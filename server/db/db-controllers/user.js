const dbManager = require("../../config/db");
const appDb = dbManager.getConnections()[0];
const User = require("../model/user")(appDb);
const Post = require("../model/post")(appDb);
const ResetPasswordToken = require("../model/reset-password-token")(appDb);
const mongoose = require("mongoose");
const {getUnverifiedUserRegisterType, getSameFriends} = require("../../utils/user-utils");
const {isValidDate} = require("../../utils/common-utils");
const ObjectId = mongoose.Types.ObjectId;
const {ApplicationError} = require("../../utils/error/error-types");
const omit = require("lodash/omit");
const pick = require("lodash/pick");
const {createAuthToken} = require("../../authorization/auth");
const {getPrivateKey, getPublicKey} = require("../../authorization/keys/keys");
const {createNewConfirmToken} = require("./confirm-token");
const {twilioSmsService, nexmoSmsService} = require("../../common/sms-service/sms-service");
const emailService = require("../../common/email-service/email-service");

const USER_FRIEND_RELATION = {
    FRIEND: "FRIEND",
    NOT_FRIEND: "NOT_FRIEND",
    PENDING: "PENDING"
}

const sendResetPasswordToken = ({credentials, user}) => {
    if (credentials.register_type === "PHONE") {

        return nexmoSmsService.sendSms(
            user.contact.login_username.phone,
            `Mã xác nhận đổi mật khẩu của bạn là: ${credentials.token}`
        )
            .then(() => credentials)
            .catch(() => Promise.reject(new ApplicationError("send_sms_failed")))
    } else {
        return emailService.sendEmail({
            from: "Kappa Support",
            to: user.contact.login_username.email,
            subject: "Xác nhận đổi mật khẩu",
            template: "reset-password",
            context: {
                name: `${user.basic_info.username}`,
                appUrl: `${process.env.APP_URI}`,
                email: `${user.contact.login_username.email}`,
                token: `${credentials.token}`
            }
        }).then(() => {

            return credentials;
        }).catch(err => {
            return Promise.reject(new ApplicationError("send_email_failed"))
        })
    }

};

const getAuthenticateUserInitCredentials = (userID) => {
    return User.findOne({_id: ObjectId(userID)}, "_id contact basic_info joined_at isVerify last_active_at dark_mode search_history followed_posts saved_posts blocked_posts avatar person_blocked").lean()
        .then(data => {
            if (!data) {
                return Promise.reject(new ApplicationError("account_not_existed"))
            }

            return {
                ...data,
                search_history: data.search_history.sort((a, b) => new Date(b.search_at).getTime() - new Date(a.search_at).getTime())
            };

        })

};

const shortLogin = ({_id, password}) => {
    return User.findOne({
        _id: ObjectId(_id),
        "private_info.password": password.trim()
    }, "_id contact basic_info joined_at chat_settings isVerify chat_settings person_blocked last_active_at dark_mode private_info search_history followed_posts saved_posts blocked_posts avatar").lean()
        .then((data) => {
            if (!data) {
                return Promise.reject(new ApplicationError("wrong_password"));
            }

            if (!data.isVerify) {
                return Promise.reject(new ApplicationError("account_not_verified"));
            }
            return createAuthToken(pick(data, ["_id", "contact"]), getPrivateKey(), {
                algorithm: "RS256"
            }).then(token => {
                return {
                    token,
                    user: {
                        ...omit(data, "private_info"),
                        search_history: data.search_history.sort((a, b) => new Date(b.search_at).getTime() - new Date(a.search_at).getTime())
                    }
                }
            })
        });
};

const login = ({login_username, password}) => {

    return User.findOne({
        $or: [
            {"contact.login_username.phone": login_username},
            {"contact.login_username.email": login_username},
        ]
    }, "_id contact basic_info joined_at followed_posts person_blocked saved_posts blocked_posts isVerify last_active_at chat_settings dark_mode private_info search_history avatar").lean()
        .then((data) => {
            if (!data || data.private_info.password !== password) {
                return Promise.reject(new ApplicationError("account_not_existed"));
            }

            if (!data.isVerify) {
                return Promise.reject(new ApplicationError("account_not_verified", {
                    userID: data._id,
                    registerType: getUnverifiedUserRegisterType(data)
                }));
            }
            return createAuthToken(pick(data, ["_id", "contact"]), getPrivateKey(), {
                algorithm: "RS256"
            }).then(token => {
                return {
                    token,
                    user: {
                        ...omit(data, "private_info"),
                        search_history: data.search_history.sort((a, b) => new Date(b.search_at).getTime() - new Date(a.search_at).getTime())
                    }
                }
            })
        });
};

const sendChangePasswordToken = ({email = "", phone = ""}) => {
    let query = email ? {
        "contact.login_username.email": email,
    } : {
        "contact.login_username.phone": phone,
    };
    return User.findOne(query).lean()
        .then(data => {
            if (!data) {
                return Promise.reject(new ApplicationError("account_not_existed"));
            }
            console.log(data);
            return createNewConfirmToken({
                userID: data._id,
                registerType: email ? "EMAIL" : "PHONE"
            }, "password")
                .then((credentials) => {
                    return {
                        credentials,
                        user: data
                    }
                })
                .then(sendResetPasswordToken)
                .then(credentials => ({
                    sessionID: credentials._id,
                    register_type: credentials.register_type,
                    user: pick(data, ["_id", "contact", "basic_info"])
                }))
        })

};

const resendChangePasswordToken = ({userID, registerType}) => {

    return User.findOne({_id: userID}).lean()
        .then(data => {
            if (!data) {
                return Promise.reject(new ApplicationError("account_not_existed"));
            }

            return createNewConfirmToken({
                userID: data._id,
                registerType
            }, "password")
                .then((credentials) => {
                    return {
                        credentials,
                        user: data
                    }
                })
                .then(sendResetPasswordToken)
                .then(credentials => ({
                    sessionID: credentials._id,
                    register_type: credentials.register_type,
                    user: pick(data, ["_id", "contact", "basic_info"])
                }))
        })
};

const verifyChangePasswordToken = ({token, sessionID}) => {
    return ResetPasswordToken.findOne({
        token: token.toUpperCase(),
        _id: ObjectId(sessionID)
    }).lean()
        .then(data => {
            if (!data) {
                return Promise.reject(new ApplicationError("wrong_token"))
            }
            return ResetPasswordToken.findOneAndUpdate({_id: ObjectId(sessionID)}, {$set: {isVerify: true}}, {new: true}).lean()
        })
};

const getChangePasswordUserBrief = sessionID => {
    console.log(sessionID)
    return ResetPasswordToken.findOne({
        _id: ObjectId(sessionID),
        isVerify: true
    }).populate("user", "_id")
        .then(data => {
            console.log(data)
            if (!data) {
                return Promise.reject();
            }
            return data.toObject();
        })
};

const changePassword = ({sessionID, newPassword}) => {
    return ResetPasswordToken.findOneAndDelete({
        _id: ObjectId(sessionID)
    }).lean()
        .then(data => {
            if (!data) {
                return Promise.reject();
            }
            return User.findOneAndUpdate({_id: ObjectId(data.user)}, {$set: {"private_info.password": newPassword.trim()}})
                .then(() => null);
        })
};

const addNewSearchHistory = (userID, data) => {
    console.log(data)
    if (!data) {
        return Promise.reject(new ApplicationError());
    }
    return User.findOneAndUpdate({_id: ObjectId(userID)},
        {
            $pull: {
                search_history: {
                    content: data.content,
                    related_person: null,
                    related_group: null,
                    related_page: null
                }
            },
        })
        .then(() => User.findOneAndUpdate({_id: ObjectId(userID)},
            {
                $push: {
                    search_history: data
                }
            },
            {new: true, select: "_id search_history"}).lean())
        .then(data => {
            return {
                ...data,
                search_history: data.search_history.sort((a, b) => new Date(b.search_at).getTime() - new Date(a.search_at).getTime())
            }
        })

};

const deleteSearchHistory = (userID, historyID) => {
    if (!historyID) {
        return Promise.reject(new ApplicationError());
    }
    return User.findOneAndUpdate({_id: ObjectId(userID)},
        {
            $pull: {
                search_history: {
                    _id: ObjectId(historyID)
                }
            }
        },
        {new: true, select: "_id search_history"}).lean()
        .then(data => {
            return {
                ...data,
                search_history: data.search_history.sort((a, b) => new Date(b.search_at).getTime() - new Date(a.search_at).getTime())
            }
        })
};

const updateSearchHistory = (userID, historyID, data) => {
    console.log(data);
    let updatedQuery = {
        "search_history.$.search_at": Date.now()
    };
    if (data.related_person) {
        updatedQuery["search_history.$.related_person"] = ObjectId(data.related_person)
    } else if (data.related_page) {
        updatedQuery["search_history.$.related_page"] = ObjectId(data.related_page)
    } else if (data.related_group) {
        updatedQuery["search_history.$.related_group"] = ObjectId(data.related_group)
    }
    if (!historyID) {
        return Promise.reject(new ApplicationError());
    }
    return User.findOneAndUpdate({_id: ObjectId(userID), "search_history._id": ObjectId(historyID)},
        {
            $set: updatedQuery
        },
        {new: true, select: "_id search_history"}).lean()
        .then(data => {
            return {
                ...data,
                search_history: data.search_history.sort((a, b) => new Date(b.search_at).getTime() - new Date(a.search_at).getTime())
            }
        })

};

const simpleUpdateUser = (userID, data) => {
    return User.findOneAndUpdate({_id: ObjectId(userID)}, {$set: data}, {
        new: true,
        select: "followed_posts saved_posts blocked_posts person_blocked _id contact basic_info joined_at isVerify last_active_at dark_mode private_info search_history avatar"
    }).lean()
};

const getUserBasicInfo = (userID, query = {}) => {

    return User.findOne(ObjectId.isValid(userID) ? {
        _id: ObjectId(userID)
    } : {
        "basic_info.profile_link": userID
    }, query.full === 'true' ? "_id basic_info avatar contact cover_photo bio" : "_id basic_info avatar cover_photo bio").lean()
}

const toggleFollowPost = ({postID, userID}) => {
    return User.findOne({
        _id: ObjectId(userID)
    }).lean()
        .then(user => {

            let isPull = user.followed_posts.find(each => each.post.toString() === postID);
            let query = isPull ? {
                $pull: {
                    followed_posts: {
                        post: ObjectId(postID)
                    }
                }
            } : {
                $addToSet: {
                    followed_posts: {
                        post: ObjectId(postID),
                    }
                }
            };
            return User.findOneAndUpdate({
                _id: ObjectId(userID)
            }, query, {
                new: true
            }).lean().then(u => ({
                followed_posts: u.followed_posts,
                actionType: isPull ? "UN_FOLLOWED" : "FOLLOWED"
            }))

        })

}

const toggleSavePost = ({postID, userID}) => {
    return User.findOne({
        _id: ObjectId(userID)
    }).lean()
        .then(user => {
            let query = user.saved_posts.find(each => each._id.toString() === postID) ? {
                $pull: {
                    saved_posts: ObjectId(postID)
                }
            } : {
                $addToSet: {
                    saved_posts: ObjectId(postID)
                }
            };
            return User.findOneAndUpdate({
                _id: ObjectId(userID)
            }, query, {
                new: true
            }).lean()

        })
        .then(u => ({
            saved_posts: u.saved_posts
        }))
}

const toggleBlockPost = ({postID, userID}) => {
    return User.findOne({
        _id: ObjectId(userID)
    }).lean()
        .then(user => {
            let query = user.blocked_posts.find(each => each._id.toString() === postID) ? {
                $pull: {
                    blocked_posts: ObjectId(postID)
                }
            } : {
                $addToSet: {
                    blocked_posts: ObjectId(postID)
                }
            };
            return User.findOneAndUpdate({
                _id: ObjectId(userID)
            }, query, {
                new: true
            }).lean()

        })
        .then(u => ({
            blocked_posts: u.blocked_posts
        }))
}

const createUserNotification = ({type, data, userID}) => {
    let notificationID = new ObjectId();
    return User.findOneAndUpdate({
        _id: ObjectId(userID)
    }, {
        $push: {
            notifications: {
                _id: notificationID,
                notification_type: type,
                ...data,
            }
        }
    }, {
        new: true
    }).populate([
        {
            path: "notifications.person",
            model: "User",
            select: "_id basic_info avatar last_active_at active"
        }, {
            path: "notifications.page",
            model: "Page",
            select: "_id basic_info avatar",

        }, {
            path: "notifications.group",
            model: "Group",
            select: "_id basic_info"
        }, {
            path: "notifications.reacted_by",
            model: "User",
            select: "_id basic_info  avatar last_active_at active"
        }, {
            path: "notifications.comment",
            model: "Comment",
            populate: [
                {
                    path: "from_person",
                    model: "User",
                    select: "_id basic_info avatar last_active_at active"
                }, {
                    path: "from_page",
                    model: "Page",
                    select: "_id basic_info avatar"
                }
            ]

        }, {
            path: "notifications.reply",
            model: "Comment",
            populate: [
                {
                    path: "from_person",
                    model: "User",
                    select: "_id basic_info avatar last_active_at active"
                }, {
                    path: "from_page",
                    model: "Page",
                    select: "_id basic_info avatar"
                }
            ]
        }, {
            path: "notifications.post",
            model: "Post",
            populate: [
                {
                    path: "belonged_person",
                    model: "User",
                    select: "_id basic_info avatar last_active_at active"
                }, {
                    path: "belonged_wall",
                    model: "User",
                    select: "_id basic_info avatar last_active_at active"
                },
            ]
        },
    ])
        .then(user => {
            return user.notifications.sort((a, b) => new Date(b.published_time).getTime() - new Date(a.published_time).getTime())[0]
        })
}

const getFollowedUserByPost = (postID) => {
    return User.find({
        "followed_posts.post": ObjectId(postID)
    }).lean()
}

const getMentionsUserByComment = (comment) => {
    let {mentions} = comment;
    return User.find({
        _id: {
            $in: mentions.map(each => ObjectId(each.related._id))
        }
    }).lean()
}

const getUnseenNotificationsCount = ({userID}) => {
    return User.findOne({
        _id: ObjectId(userID)
    }).lean()
        .then(u => u.notifications.filter(each => !each.is_seen).length)
}
const getUserNotifications = ({userID, skip}) => {
    return User.findOne({
        _id: ObjectId(userID)
    })
        .populate([
            {
                path: "notifications.reacted_by",
                model: "User",
                select: "_id basic_info  avatar last_active_at active"
            },
            {
                path: "notifications.person",
                model: "User",
                select: "_id basic_info avatar last_active_at active"
            }, {
                path: "notifications.page",
                model: "Page",
                select: "_id basic_info avatar",

            }, {
                path: "notifications.group",
                model: "Group",
                select: "_id basic_info"
            }, {
                path: "notifications.comment",
                model: "Comment",
                populate: [
                    {
                        path: "from_person",
                        model: "User",
                        select: "_id basic_info avatar last_active_at active"
                    }, {
                        path: "from_page",
                        model: "Page",
                        select: "_id basic_info avatar"
                    }
                ]

            }, {
                path: "notifications.reply",
                model: "Comment",
                populate: [
                    {
                        path: "from_person",
                        model: "User",
                        select: "_id basic_info avatar last_active_at active"
                    }, {
                        path: "from_page",
                        model: "Page",
                        select: "_id basic_info avatar"
                    }
                ]
            }, {
                path: "notifications.post",
                model: "Post",
                populate: [
                    {
                        path: "belonged_person",
                        model: "User",
                        select: "_id basic_info avatar last_active_at active"
                    },
                ]
            },
        ])
        .then(u => (
            {
                notifications: u.notifications.sort((a, b) => new Date(b.published_time).getTime() - new Date(a.published_time).getTime()).slice(Number(skip), Number(skip) + 7),
                total: u.notifications.length
            }
        ))
}

const seenNotifications = ({userID, notifications}) => {
    return User.findOneAndUpdate({
        _id: ObjectId(userID)
    }, {"$set": {"notifications.$[elem].is_seen": true}}, {
        "arrayFilters": [{"elem._id": {$in: notifications.map(each => ObjectId(each))}}],
        "multi": true,
        new: true
    }).exec()
}

const getUserFriendsCount = ({userID}) => {
    return User.findOne({_id: ObjectId(userID)})
        .lean()
        .then((data) => ({count: data.friends.length}))
}

const checkIsFriend = (userID, friendID) => {
    return Promise.all([
        User.findOne({
            _id: ObjectId(userID)
        })
            .lean(),
        User.findOne(ObjectId.isValid(friendID) ? {
            _id: ObjectId(friendID)
        } : {
            "basic_info.profile_link": friendID
        })
            .lean()
    ])
        .then(([user, friend]) => {
            console.log(friend)
            return {
                value: friend.friend_requests.find(each => each.toString() === userID) ?
                    USER_FRIEND_RELATION.PENDING :
                    user.friends.find(each => each.info.toString() === friend._id.toString()) ?
                        USER_FRIEND_RELATION.FRIEND : USER_FRIEND_RELATION.NOT_FRIEND
            }
        })
}

const unfriend = (userID, friendID) => {
    return Promise.all([
        Post.find({
            belonged_person: ObjectId(userID),
            policy: {
                $ne: "PUBLIC"
            }
        }).lean(),
        Post.find({
            belonged_person: ObjectId(friendID),
            policy: {
                $ne: "PUBLIC"
            }
        }).lean()
    ])

        .then(([friend_non_public_from_user, user_non_public_from_friend]) => {
            return Promise.all([
                User.findOneAndUpdate({
                    _id: ObjectId(userID)
                }, {
                    $pull: {
                        friends: {
                            info: ObjectId(friendID)
                        },
                        followed_posts: {
                            post: {
                                $in: user_non_public_from_friend
                            }

                        },
                        saved_posts: {
                            $in: friend_non_public_from_user
                        },
                    }
                }).exec(),
                User.findOneAndUpdate({
                    _id: ObjectId(friendID)
                }, {
                    $pull: {
                        friends: {
                            info: ObjectId(userID)
                        },
                        followed_posts: {
                            post: {
                                $in: friend_non_public_from_user
                            }

                        },
                        saved_posts: {
                            $in: friend_non_public_from_user
                        },
                    }
                }).exec()
            ])
                .then(() => null)
        })
}

const sendFriendRequest = (userID, friendID) => {
    return User.findOneAndUpdate({
        _id: ObjectId(friendID),
        friend_requests: {
            $ne: ObjectId(userID)
        }
    }, {
        $push: {
            friend_requests: ObjectId(userID)
        }
    }).exec()
}

const cancelFriendRequest = (userID, friendID) => {
    return User.findOneAndUpdate({
        _id: ObjectId(friendID),
        friend_requests: ObjectId(userID)
    }, {
        $pull: {
            friend_requests: ObjectId(userID)
        }
    }).exec()
}
const deleteNotificationByType = (userID, type, condition) => {
    return User.findOneAndUpdate({
        _id: ObjectId(userID)
    }, {
        "$pull": {
            "notifications": {
                notification_type: type,
                ...condition
            }
        }
    }).exec()
}

const acceptFriendRequest = (userID, friendID) => {
    return Promise.all([
        User.findOneAndUpdate({
            _id: ObjectId(friendID),
            "friends.info": {
                $ne: ObjectId(userID)

            }
        }, {
            $push: {
                friends: {
                    info: ObjectId(userID)
                }
            }
        }).exec(),
        User.findOneAndUpdate({
            _id: ObjectId(userID),
            "friends.info": {
                $ne: ObjectId(friendID)

            }
        }, {
            $push: {
                friends: {
                    info: ObjectId(friendID)
                }
            }
        }).exec(),
        User.findOneAndUpdate({
            _id: ObjectId(friendID),
            friend_requests: ObjectId(userID),

        }, {
            $pull: {
                friend_requests: ObjectId(userID)
            },

        }).exec()
    ])
}
const getUserFriends = (callerID, userID, config) => {
    let {skip = 0, limit = 8, mode = 'all', keyword} = config;
    let pipelines = [
        {
            $match: {
                _id: ObjectId(userID)
            }
        },
        {
            $unwind: "$friends"
        },
        {
            $lookup: {
                from: 'users', localField: 'friends.info', foreignField: '_id', as: "friends.info"
            }
        }, {
            $addFields: {
                "friends.info": {
                    $arrayElemAt: ["$friends.info", 0]
                }
            }
        },
    ];
    if (keyword) {
        pipelines.push({
            $match: {
                "friends.info.basic_info.username": {$regex: keyword, $options: "i"}
            }
        },)
    }
    if (mode === "same_city") {
        pipelines = pipelines.concat([
            {
                $match: {$expr: {$eq: ["$contact.address.city", "$friends.info.contact.address.city"]}}
            }
        ])
    }
    if (mode !== "birthday") {
        pipelines.push({
            $sort: {
                "friends.info.basic_info.username": -1
            }
        },)
    }
    return Promise.all([
        User.aggregate(pipelines),
        User.findOne({
            _id: ObjectId(callerID)
        }).lean(),
        User.findOne({
            _id: ObjectId(userID)
        }).lean()
    ]).then(([data, caller, user]) => {
        let list = [...data];
        let total = data.length;
        if (mode === "birthday") {
            let now = new Date();
            list = list.map(each => {
                let birthday = new Date(each.friends.info.basic_info.dob);
                let currentYear = new Date().getFullYear();

                let thisYearBirthday = new Date(currentYear, birthday.getMonth(), birthday.getDate());


                if (isValidDate(thisYearBirthday)) {
                    return {
                        ...each,
                        birthday_countdown: thisYearBirthday.getTime() - now.getTime()
                    };
                }
                return {
                    ...each,
                    birthday_countdown: -1
                };
            })
                .filter(each => each.birthday_countdown < 259200000 && each.birthday_countdown >= 0)
                .sort((a, b) => a.birthday_countdown - b.birthday_countdown)
            ;
            total = list.length;
        }
        if (mode === "same_friends") {
            list = list.filter(each => caller.friends.find(f => f.info.toString() === each.friends.info._id.toString()));
            total = list.length
        }
        list = list
            .slice(Number(skip), Number(skip) + Number(limit))
            .map(each => ({
                ...each,
                same_friends_count: getSameFriends(each.friends.info.friends.map(each => each.info.toString()), caller.friends.map(each => each.info.toString())).length,
                caller_friend_status: !!caller.friends.find(f => f.info.toString() === each.friends.info._id.toString()) ? "FRIEND" : each.friend_requests.find(each => each.toString() === callerID) ? "PENDING" : "NOT_FRIEND"
            }))
            .map(each => ({
                birthday_countdown: each.birthday_countdown,
                caller_friend_status: each.caller_friend_status,
                same_friends_count: each.same_friends_count, ...pick(each.friends.info, ["_id", "avatar", "basic_info"])
            }));
        return {
            list,
            total
        }
    });
}

const getUserFriendInvitations = (userID, {totalOnly = false, skip = 0, limit = 8}) => {
    return User.findOne({
        _id: ObjectId(userID)
    })

        .populate("friend_requests", "_id basic_info avatar friends")
        .then((user) => {
            return {
                list: user.friend_requests
                    .map(each => ({

                        same_friends_count: getSameFriends(each.friends.map(each => each.info.toString()), user.friends.map(each => each.info.toString())).length,
                        ...omit(each.toObject(), "friends")
                    })).slice(Number(skip), Number(skip) + Number(limit)),
                total: user.friend_requests.length
            }
        })
        .then(data => omit(data, totalOnly ? "list" : ""))
};

const getUserAboutBrief = (userID) => {
    return User.findOne({
        _id: ObjectId(userID)
    }).populate([
        {
            path: "relationship.related",
            model: "User",
            select: "_id basic_info avatar"
        }, {
            path: "works.company.related",
            model: "Page",
            select: "_id basic_info avatar"
        }, {
            path: "schools.school.related",
            model: "Page",
            select: "_id basic_info avatar"
        }, {
            path: "contact.address.city",
            model: "City",
        }, {
            path: "contact.address.ward",
            model: "Ward",
        }, {
            path: "contact.address.district",
            model: "District",
        }, {
            path: "contact.home_town.city",
            model: "City",
        }, {
            path: "contact.home_town.ward",
            model: "Ward",
        }, {
            path: "contact.home_town.district",
            model: "District",
        },
    ])
        .then((data) => {
            return pick(data, ["_id", "basic_info", "relationship", "contact", "works", "schools", "favorites", "user_about_privacy"])
        });
}

const upsertUserWork = (userID, payload) => {

    if (!payload.workID) {


        return User.findOneAndUpdate({
            _id: ObjectId(userID)
        }, {
            $push: {
                works: payload.work
            }
        }, {new: true}).lean().exec()
    }
    return User.findOneAndUpdate({
        _id: ObjectId(userID)
    }, {
        "$set": {
            "works.$[elem]": {
                ...payload.work,
                last_updated: Date.now()
            }
        }
    }, {
        "arrayFilters": [{"elem._id": ObjectId(payload.workID)}],
        new: true
    }).lean().exec()
}

const upsertUserSchool = (userID, payload) => {
    if (!payload.schoolID) {

        return User.findOneAndUpdate({
            _id: ObjectId(userID)
        }, {
            $push: {
                schools: payload.school
            }
        }, {new: true}).lean().exec()
    }
    return User.findOneAndUpdate({
        _id: ObjectId(userID)
    }, {
        "$set": {
            "schools.$[elem]": {
                ...payload.school,
                last_updated: Date.now()
            }
        }
    }, {
        "arrayFilters": [{"elem._id": ObjectId(payload.schoolID)}],
        new: true
    }).lean().exec()
}

const deleteWork = ({userID, workID}) => {
    return User.findOneAndUpdate({
        _id: ObjectId(userID)
    }, {
        $pull: {
            works: {
                _id: ObjectId(workID)
            }
        }
    },  {new: true}).lean().exec()
}

const deleteSchool = ({userID, schoolID}) => {
    return User.findOneAndUpdate({
        _id: ObjectId(userID)
    }, {
        $pull: {
            schools: {
                _id: ObjectId(schoolID)
            }
        }
    },  {new: true}).lean().exec()
}
const upsertUserFavorites = (userID, payload) => {
    return User.findOneAndUpdate({
        _id: ObjectId(userID)
    }, {
        "$set": {
            "favorites": payload.favorites
        }
    }, {
        new: true
    }).lean().exec()
}

module.exports = {
    upsertUserFavorites,
    deleteWork,
    deleteSchool,
    upsertUserWork,
    upsertUserSchool,
    getUserAboutBrief,
    getUserFriendInvitations,
    getUserFriends,
    acceptFriendRequest,
    deleteNotificationByType,
    cancelFriendRequest,
    sendFriendRequest,
    unfriend,
    checkIsFriend,
    seenNotifications,
    getUserNotifications,
    getUnseenNotificationsCount,
    getMentionsUserByComment,
    getFollowedUserByPost,
    createUserNotification,
    getAuthenticateUserInitCredentials,
    login,
    sendChangePasswordToken,
    resendChangePasswordToken,
    verifyChangePasswordToken,
    getChangePasswordUserBrief,
    changePassword,
    addNewSearchHistory,
    deleteSearchHistory,
    updateSearchHistory,
    shortLogin,
    simpleUpdateUser,
    getUserBasicInfo,
    toggleFollowPost,
    toggleSavePost,
    toggleBlockPost,
    getUserFriendsCount
};