const express = require('express');
const router = express.Router();
const {authorizationUserMiddleware} = require("../common/middlewares/common");
const {globalSearch, preSearch, getLoginSessionsBrief} = require("../db/db-controllers/utility");

module.exports = () => {
    router.get("/search-global", authorizationUserMiddleware, (req, res, next) => {
        return res.status(200).json([]);
        // return getAuthenticateUserInitCredentials(req.user._id).then((data) => {
        //     return res.status(200).json(data);
        // }).catch(err => next(err));

    });
    router.get("/pre-search", authorizationUserMiddleware, (req, res, next) => {
        return preSearch(req.user._id, decodeURIComponent(req.query.keyword)).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.get("/search/dialogs", authorizationUserMiddleware, (req, res, next) => {
        return Promise.resolve({
            contacts: [
                {_id: "1", last_active: new Date("12/01/1998"), basic_info: {username: "Tuan Anh"}, avatar: "https://lucloi.vn/wp-content/uploads/2020/02/218_copy.jpg", active: true},
                {_id: "2", last_active: new Date(), basic_info: {username: "Quang Cuong"}},
                {_id: "3", last_active: new Date(), basic_info: {username: "Tuan Hoang"}, avatar: "https://images-na.ssl-images-amazon.com/images/I/61RbIsRjqeL._AC_UL1000_.jpg", active: true},
                {_id: "4", last_active: new Date(), basic_info: {username: "Quoc Viet"}, avatar: "https://video-images.vice.com/test-uploads/articles/5e8e11711f3611009884b77f/lede/1586369199663-lede-pallbearer.png?crop=0.8747xw:0.9671xh;0.0054xw,0.0319xh"},
                {_id: "5", last_active: new Date(), basic_info: {username: "Xuan Thang"}},
                {_id: "6", last_active: new Date(), basic_info: {username: "Ngoc"}},
                {_id: "8", last_active: new Date(), basic_info: {username: "Tuan Trung"}, active: true},
                {_id: "7", last_active: new Date(), basic_info: {username: "Huan Hoa Hong"}},
                {_id: "9", last_active: new Date(), basic_info: {username: "Bitchesssssssssssssssssssssssssssssss"}, active: true},
            ],
            pages: [
                {_id: "6",  basic_info: {name: "GearVN"}},
                {_id: "8",  basic_info: {name: "Aha"}},
            ],
            chat_groups: [{
                _id: "1",
                group_name: "Con Nghien",
                users: [
                    {
                        _id: "1",
                        avatar: "https://i.ytimg.com/vi/IuB2LQtscfs/maxresdefault.jpg"
                    } , {
                        _id: "2",
                        avatar: "https://znews-photo.zadn.vn/w660/Uploaded/fsmqv/2015_02_12/luyen_3.jpg"
                    }
                ],
                active: true,
                last_active: new Date()
            }, {
                _id: "2",
                users: [
                    {
                        _id: "1",
                        basic_info: {
                            username: "Tuan Hoang"
                        }
                    } , {
                        _id: "2",
                        avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Red_Ribbon.svg/220px-Red_Ribbon.svg.png",
                        basic_info: {
                            username: "Suc Cac"
                        }
                    },  {
                        _id: "3",
                        avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Red_Ribbon.svg/220px-Red_Ribbon.svg.png",
                        basic_info: {
                            username: "Vinataba"
                        }
                    }
                ],
                active: false,
                last_active: new Date()
            }, {
                _id: "3",
                group_name: "Dit con me group nhu con cacccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
                users: [
                    {
                        _id: "1",
                        avatar: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Sida-aids.png"
                    } , {
                        basic_info: {
                            username: "Xuan Thang"
                        },
                        _id: "2",
                    }
                ],

                active: true,
                last_active: new Date()
            }]
        }).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.get("/search-for-create/dialogs", authorizationUserMiddleware, (req, res, next) => {
        return Promise.resolve([
            {_id: "1", last_active: new Date("12/01/1998"), basic_info: {username: "Tuan Anh"}, avatar: "https://lucloi.vn/wp-content/uploads/2020/02/218_copy.jpg", active: true},
            {_id: "2", last_active: new Date(), basic_info: {username: "Quang Cuong"}},
            {_id: "3", last_active: new Date(), basic_info: {username: "Tuan Hoang"}, avatar: "https://images-na.ssl-images-amazon.com/images/I/61RbIsRjqeL._AC_UL1000_.jpg", active: true},
            {_id: "4", last_active: new Date(), basic_info: {username: "Quoc Viet"}, avatar: "https://video-images.vice.com/test-uploads/articles/5e8e11711f3611009884b77f/lede/1586369199663-lede-pallbearer.png?crop=0.8747xw:0.9671xh;0.0054xw,0.0319xh"},
            {_id: "5", last_active: new Date(), basic_info: {username: "Xuan Thang"}},
            {_id: "6", last_active: new Date(), basic_info: {username: "Ngoc"}},
            {_id: "8", last_active: new Date(), basic_info: {username: "Tuan Trung"}, active: true},
            {_id: "7", last_active: new Date(), basic_info: {username: "Huan Hoa Hong"}},
            {_id: "9", last_active: new Date(), basic_info: {username: "Bitchesssssssssssssssssssssssssssssss"}, active: true},
            {_id: "10",  basic_info: {name: "GearVN"}},
            {_id: "11",  basic_info: {name: "Aha"}},
            {
                _id: "123",
                group_name: "Con Nghien",
                users: [
                    {
                        _id: "1",
                        avatar: "https://i.ytimg.com/vi/IuB2LQtscfs/maxresdefault.jpg"
                    } , {
                        _id: "2",
                        avatar: "https://znews-photo.zadn.vn/w660/Uploaded/fsmqv/2015_02_12/luyen_3.jpg"
                    }
                ],
                active: true,
                is_group_chat: true
            }, {
                _id: "232",
                users: [
                    {
                        _id: "1",
                        basic_info: {
                            username: "Tuan Hoang"
                        }
                    } , {
                        _id: "2",
                        avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Red_Ribbon.svg/220px-Red_Ribbon.svg.png",
                        basic_info: {
                            username: "Suc Cac"
                        }
                    },  {
                        _id: "3",
                        avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Red_Ribbon.svg/220px-Red_Ribbon.svg.png",
                        basic_info: {
                            username: "Vinataba"
                        }
                    }
                ],
                active: false,
                is_group_chat: true
            }, {
                _id: "33123",
                group_name: "Dit con me group nhu con cacccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",
                users: [
                    {
                        _id: "1",
                        avatar: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Sida-aids.png"
                    } , {
                        basic_info: {
                            username: "Xuan Thang"
                        },
                        _id: "2",
                    }
                ],

                active: true,
                is_group_chat: true
            }

        ]).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    router.post("/login-sessions/brief", (req, res, next) => {
        return getLoginSessionsBrief(req.body).then((data) => {
            return res.status(200).json(data);
        }).catch(err => next(err));

    });
    return router;
};