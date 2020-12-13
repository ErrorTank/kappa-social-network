const dbManager = require('../../config/db');
const appDb = dbManager.getConnections()[0];
const User = require('../model/user')(appDb);
const Post = require('../model/post')(appDb);
const Comment = require('../model/comment')(appDb);
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const { ApplicationError } = require('../../utils/error/error-types');
const { scorizeArray } = require('../../utils/common-utils');
const omit = require('lodash/omit');
const pick = require('lodash/pick');
const { MessageState } = require('../../common/const/message-state');
const { REVERSE_REACTIONS } = require('../../utils/messenger-utils');

const createNewPost = (value) => {
  let newPost = {
    ...value,
    _id: new ObjectId(),
    listing: ObjectId(value.listing),
  };
  let promises = [
    new Post(newPost).save(),
    User.findOneAndUpdate(
      {
        _id: ObjectId(value.belonged_person),
      },
      {
        $push: {
          followed_posts: {
            post: ObjectId(newPost._id),
          },
        },
      }
    ),
  ];
  if (value.shared_post) {
    promises.push(
      Post.findOneAndUpdate(
        {
          _id: ObjectId(value.shared_post),
        },
        {
          $inc: {
            share_count: 1,
          },
        },
        {
          new: true,
        }
      )
    );
  }
  return Promise.all(promises).then(([newPost, _, shared_post]) => {
    return [newPost, shared_post];
  });
};

const getAllPosts = ({ userID, skip, limit }) => {
  return User.findOne({
    _id: ObjectId(userID),
  })
    .lean()
    .then((user) => {
      let {
        friends: _friends,
        page_blocked: _page_blocked,
        person_blocked: _person_blocked,
        blocked_posts: _blocked_posts,
        joined_groups: _joined_groups,
        group_blocked: _group_blocked,
        liked_pages: _liked_pages,
        followed_posts: _followed_posts,
      } = user;
      // console.log(_friends)
      let friends = _friends.map((each) => ObjectId(each.info));
      let page_blocked = _page_blocked.map((each) => ObjectId(each));
      let person_blocked = _person_blocked.map((each) => ObjectId(each));
      let blocked_posts = _blocked_posts.map((each) => ObjectId(each));
      let joined_groups = _joined_groups.map((each) => ObjectId(each));
      let group_blocked = _group_blocked.map((each) => ObjectId(each));
      let liked_pages = _liked_pages.map((each) => ObjectId(each));
      let followed_posts = _followed_posts.map((each) => ObjectId(each.post));
      return Post.aggregate([
        {
          $match: {
            $and: [
              {
                _id: {
                  $nin: blocked_posts,
                },
              },
              {
                belonged_person: {
                  $nin: person_blocked,
                },
              },
              {
                belonged_page: {
                  $nin: page_blocked,
                },
              },
              {
                belonged_group: {
                  $nin: group_blocked,
                },
              },
              {
                $or: [
                  {
                    belonged_wall: {
                      $exists: false,
                    },
                  },
                  {
                    belonged_wall: null,
                  },
                ],
              },
              {
                $or: [
                  {
                    belonged_person: ObjectId(userID),
                  },
                  {
                    belonged_person: {
                      $in: friends,
                    },
                  },
                  {
                    belonged_page: {
                      $in: liked_pages,
                    },
                  },
                  {
                    _id: {
                      $in: followed_posts,
                    },
                  },
                  {
                    belonged_group: {
                      $in: joined_groups,
                    },
                  },
                  {
                    policy: 'PUBLIC',
                  },
                  {
                    $and: [
                      {
                        policy: 'PERSONAL',
                      },
                      {
                        belonged_person: ObjectId(userID),
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
        {
          $addFields: {
            love_size: {
              $size: '$reactions.love',
            },
            laugh_size: {
              $size: '$reactions.laugh',
            },
            wow_size: {
              $size: '$reactions.wow',
            },
            cry_size: {
              $size: '$reactions.cry',
            },
            angry_size: {
              $size: '$reactions.angry',
            },
            thump_up_size: {
              $size: '$reactions.thump_up',
            },
            thump_down_size: {
              $size: '$reactions.thump_down',
            },
          },
        },
        {
          $addFields: {
            comments_count: { $size: '$comments' },
            reaction_count: {
              $add: [
                '$love_size',
                '$laugh_size',
                '$wow_size',
                '$cry_size',
                '$cry_size',
                '$angry_size',
                '$thump_up_size',
                '$thump_down_size',
              ],
            },
          },
        },
        {
          $sort: {
            updated_at: -1,
          },
        },
        {
          $skip: Number(skip),
        },
        {
          $limit: Number(limit),
        },
        {
          $addFields: {
            file_ids: {
              $reduce: {
                input: '$files',
                initialValue: [],
                in: {
                  $setUnion: [
                    '$$value',
                    {
                      $map: {
                        input: '$$this.tagged',
                        as: 'el',
                        in: '$$el.related',
                      },
                    },
                  ],
                },
              },
            },
          },
        },

        {
          $lookup: {
            from: 'users',
            localField: 'file_ids',
            foreignField: '_id',
            as: 'file_tags',
          },
        },
        {
          $addFields: {
            files: {
              $map: {
                input: '$files',
                in: {
                  $mergeObjects: [
                    '$$this',
                    {
                      tagged: {
                        $map: {
                          input: '$$this.tagged',
                          in: {
                            $mergeObjects: [
                              '$$this',
                              {
                                related: {
                                  $arrayElemAt: [
                                    '$file_tags',
                                    {
                                      $indexOfArray: [
                                        '$file_ids',
                                        '$$this.related',
                                      ],
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
        { $project: { file_ids: 0, file_tags: 0 } },
        {
          $lookup: {
            from: 'pages',
            localField: 'belonged_page',
            foreignField: '_id',
            as: 'belonged_page',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'belonged_wall',
            foreignField: '_id',
            as: 'belonged_wall',
          },
        },
        {
          $lookup: {
            from: 'groups',
            localField: 'belonged_group',
            foreignField: '_id',
            as: 'belonged_group',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'belonged_person',
            foreignField: '_id',
            as: 'belonged_person',
          },
        },
        {
          $lookup: {
            from: 'listings',
            localField: 'listing',
            foreignField: '_id',
            as: 'listing',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'tagged',
            foreignField: '_id',
            as: 'tagged',
          },
        },
        {
          $addFields: {
            belonged_wall: {
              $arrayElemAt: ['$belonged_wall', 0],
            },
            belonged_page: {
              $arrayElemAt: ['$belonged_page', 0],
            },

            belonged_group: {
              $arrayElemAt: ['$belonged_group', 0],
            },
            belonged_person: {
              $arrayElemAt: ['$belonged_person', 0],
            },
            // "tagged": {
            //     $arrayElemAt: ["$tagged", 0]
            // },
          },
        },
        {
          $project: {
            love_size: 0,
            laugh_size: 0,
            wow_size: 0,
            cry_size: 0,
            angry_size: 0,
            thump_up_size: 0,
            thump_down_size: 0,
            comments: 0,
          },
        },
      ]);
    })
    .then((data) => {
      let scoredByComments = scorizeArray(data, 'comments_count');

      let scoredByReactions = scorizeArray(data, 'reaction_count');

      let scoredByShareCount = scorizeArray(data, 'share_count');

      return data
        .map((each, i) => ({
          ...each,
          belonged_page: each.belonged_page
            ? pick(each.belonged_page, ['_id', 'avatar', 'basic_info'])
            : null,
          belonged_person: each.belonged_person
            ? pick(each.belonged_person, ['_id', 'avatar', 'basic_info'])
            : null,
          // belonged_wall: each.belonged_wall ? pick(each.belonged_wall, ["_id", "avatar", "basic_info"]) : null,
          belonged_group: each.belonged_group
            ? pick(each.belonged_group, ['_id', 'basic_info'])
            : null,
          tagged: each.tagged.map((tag) =>
            pick(tag, ['_id', 'avatar', 'basic_info'])
          ),
          score:
            (data.length - i) * 1.5 +
            scoredByComments.find(
              (c) => c.value._id.toString() === each._id.toString()
            ).score *
              4 +
            scoredByReactions.find(
              (c) => c.value._id.toString() === each._id.toString()
            ).score *
              3 +
            scoredByShareCount.find(
              (c) => c.value._id.toString() === each._id.toString()
            ).score *
              3,
        }))
        .sort((a, b) => b.score - a.score);
      // .map(each => omit(each, "score"))
    });
};

const updateFilesInPost = ({ postID, fileID, file }) => {
  return Post.findOneAndUpdate(
    {
      _id: ObjectId(postID),
    },
    { $set: { 'files.$[elem]': { ...file }, updated_at: Date.now() } },
    {
      arrayFilters: [{ 'elem._id': ObjectId(fileID) }],
      multi: true,
      new: true,
    }
  ).then((data) => data);
};

const updatePost = ({ postID, post }) => {
  return Post.findOneAndUpdate(
    {
      _id: ObjectId(postID),
    },
    { $set: { ...post, updated_at: Date.now() } },
    { new: true }
  ).lean();
};

const updatePostReaction = ({ postID, reactionConfig, userID }) => {
  let execCommand = {
    $set: { updated_at: Date.now() },
  };

  let { on, off } = reactionConfig;
  if (on) {
    execCommand['$push'] = {
      [`reactions.${REVERSE_REACTIONS[on]}`]: ObjectId(userID),
    };
  }
  if (off) {
    execCommand['$pull'] = {
      [`reactions.${REVERSE_REACTIONS[off]}`]: ObjectId(userID),
    };
  }
  return Post.findOneAndUpdate(
    {
      _id: ObjectId(postID),
    },
    execCommand,
    { new: true }
  ).lean();
};

const getPostReactionByReactionKey = ({
  postID,
  skip = 0,
  limit = 10,
  reactionKey,
}) => {
  return Post.aggregate([
    {
      $match: {
        _id: ObjectId(postID),
      },
    },
    {
      $addFields: {
        reactions: `$reactions.${REVERSE_REACTIONS[reactionKey]}`,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'reactions',
        foreignField: '_id',
        as: 'reactions',
      },
    },
    {
      $unwind: '$reactions',
    },
    {
      $project: {
        _id: '$reactions._id',
        basic_info: '$reactions.basic_info',
        avatar: '$reactions.avatar',
      },
    },
  ]).then((data) => {
    let left = data.length - (Number(skip) + Number(limit));

    return {
      list: data.slice(Number(skip), Number(skip) + Number(limit)),
      left: left < 0 ? 0 : left,
    };
  });
};

const getPostComments = ({ postID, skip, limit, focusComment, focusReply }) => {
  return Comment.aggregate([
    {
      $match: {
        post: ObjectId(postID),
        is_reply: false,
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'from_person',
        foreignField: '_id',
        as: 'from_person',
      },
    },

    {
      $lookup: {
        from: 'pages',
        localField: 'from_page',
        foreignField: '_id',
        as: 'from_page',
      },
    },
    {
      $lookup: {
        from: 'pages',
        localField: 'mentioned_page',
        foreignField: '_id',
        as: 'mentioned_page',
      },
    },
    {
      $addFields: {
        from_person: {
          $arrayElemAt: ['$from_person', 0],
        },
        from_page: {
          $arrayElemAt: ['$from_page', 0],
        },
      },
    },
    {
      $addFields: {
        love_size: {
          $size: '$reactions.love',
        },
        laugh_size: {
          $size: '$reactions.laugh',
        },
        wow_size: {
          $size: '$reactions.wow',
        },
        cry_size: {
          $size: '$reactions.cry',
        },
        angry_size: {
          $size: '$reactions.angry',
        },
        thump_up_size: {
          $size: '$reactions.thump_up',
        },
        thump_down_size: {
          $size: '$reactions.thump_down',
        },
      },
    },
    {
      $addFields: {
        reaction_count: {
          $add: [
            '$love_size',
            '$laugh_size',
            '$wow_size',
            '$cry_size',
            '$cry_size',
            '$angry_size',
            '$thump_up_size',
            '$thump_down_size',
          ],
        },
      },
    },
    {
      $sort: {
        created_at: -1,
      },
    },
  ]).then((data) => {
    let total = data.length;
    // console.log(data)
    let returnedData = [...data];
    if (focusComment || focusReply) {
      let comment = returnedData.find((each) =>
        focusReply
          ? each.replies.find((rp) => rp.toString() === focusReply)
          : each._id.toString() === focusComment
      );

      if (comment) {
        returnedData = returnedData.filter(
          (each) => each._id.toString() !== comment._id.toString()
        );
        returnedData.unshift(comment);
      }
    }

    return {
      list: returnedData
        .slice(Number(skip), Number(skip) + Number(limit))
        .map((each) => ({
          ...each,
          from_person: pick(each.from_person, [
            '_id',
            'basic_info',
            'avatar',
            'last_active_at',
            'active',
          ]),
          from_page: pick(each.from_page, ['_id', 'basic_info', 'avatar']),
          mentioned_page: each.mentioned_page.map((item) =>
            pick(item, ['_id', 'basic_info', 'avatar'])
          ),
        })),
      total,
    };
  });
};

const createNewCommentForPost = ({ postID, comment, userID }) => {
  let newComment = {
    ...comment,
    _id: new ObjectId(),
    from_person: ObjectId(userID),
    post: ObjectId(postID),
  };
  return Promise.all([
    Post.findOneAndUpdate(
      {
        _id: ObjectId(postID),
      },
      {
        $set: {
          updated_at: Date.now(),
        },
        $addToSet: {
          comments: newComment._id,
        },
      },
      {
        new: true,
        fields: 'comments',
      }
    ),
    new Comment(newComment).save(),
    User.findOneAndUpdate(
      {
        _id: ObjectId(newComment.from_person),
        'followed_posts.post': { $ne: ObjectId(newComment.post) },
      },
      {
        $addToSet: {
          followed_posts: {
            post: ObjectId(newComment.post),
          },
        },
      }
    ),
  ]).then(([_post, data]) => data.toObject());
};

const updatePostCommentReaction = ({
  postID,
  userID,
  commentID,
  reactionConfig,
}) => {
  let execCommand = {
    $set: { updated_at: Date.now() },
  };

  let { on, off } = reactionConfig;
  if (on) {
    execCommand['$push'] = {
      [`reactions.${REVERSE_REACTIONS[on]}`]: ObjectId(userID),
    };
  }
  if (off) {
    execCommand['$pull'] = {
      [`reactions.${REVERSE_REACTIONS[off]}`]: ObjectId(userID),
    };
  }
  return Comment.findOneAndUpdate(
    {
      _id: ObjectId(commentID),
    },
    execCommand,
    {
      new: true,
    }
  )
    .lean()
    .then((comment) => {
      // console.log(comment.context)
      // console.log(messageID)
      return comment;
    });
};

const createCommentReply = ({ postID, commentID, reply, userID }) => {
  let newReply = {
    ...reply,
    _id: new ObjectId(),
    from_person: ObjectId(userID),
    post: ObjectId(postID),
    is_reply: true,
  };
  return Promise.all([
    Comment.findOneAndUpdate(
      {
        _id: ObjectId(commentID),
      },
      {
        $set: {
          updated_at: Date.now(),
        },
        $addToSet: {
          replies: newReply._id,
        },
      },
      {
        new: true,
      }
    ),
    new Comment(newReply).save(),
    User.findOneAndUpdate(
      {
        _id: ObjectId(newReply.from_person),
        'followed_posts.post': { $ne: ObjectId(newReply.post) },
      },
      {
        $addToSet: {
          followed_posts: {
            post: ObjectId(newReply.post),
          },
        },
      }
    ),
  ]).then(([_post, data]) => data);
};

const getCommentReplies = ({ commentID, skip, limit, focusReply }) => {
  return Comment.findOne({
    _id: ObjectId(commentID),
  })
    .lean()
    .then((cmt) =>
      Comment.aggregate([
        {
          $match: {
            _id: {
              $in: cmt.replies.map((each) => ObjectId(each)),
            },
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'from_person',
            foreignField: '_id',
            as: 'from_person',
          },
        },

        {
          $lookup: {
            from: 'pages',
            localField: 'from_page',
            foreignField: '_id',
            as: 'from_page',
          },
        },
        {
          $lookup: {
            from: 'pages',
            localField: 'mentioned_page',
            foreignField: '_id',
            as: 'mentioned_page',
          },
        },
        {
          $addFields: {
            from_person: {
              $arrayElemAt: ['$from_person', 0],
            },
            from_page: {
              $arrayElemAt: ['$from_page', 0],
            },
          },
        },
        {
          $addFields: {
            love_size: {
              $size: '$reactions.love',
            },
            laugh_size: {
              $size: '$reactions.laugh',
            },
            wow_size: {
              $size: '$reactions.wow',
            },
            cry_size: {
              $size: '$reactions.cry',
            },
            angry_size: {
              $size: '$reactions.angry',
            },
            thump_up_size: {
              $size: '$reactions.thump_up',
            },
            thump_down_size: {
              $size: '$reactions.thump_down',
            },
          },
        },
        {
          $addFields: {
            reaction_count: {
              $add: [
                '$love_size',
                '$laugh_size',
                '$wow_size',
                '$cry_size',
                '$cry_size',
                '$angry_size',
                '$thump_up_size',
                '$thump_down_size',
              ],
            },
          },
        },
        {
          $sort: {
            created_at: -1,
          },
        },
      ]).then((data) => {
        let total = data.length;
        // console.log(data)
        let returnedData = [...data];
        if (focusReply) {
          let comment = returnedData.find((each) =>
            each.replies.find((rp) => rp.toString() === focusReply)
          );

          if (comment) {
            returnedData = returnedData.filter(
              (each) => each._id.toString() !== comment._id.toString()
            );
            returnedData.unshift(comment);
          }
        }
        return {
          list: returnedData
            .slice(Number(skip), Number(skip) + Number(limit))
            .map((each) => ({
              ...each,
              from_person: pick(each.from_person, [
                '_id',
                'basic_info',
                'avatar',
                'last_active_at',
                'active',
              ]),
              from_page: pick(each.from_page, ['_id', 'basic_info', 'avatar']),
              mentioned_page: each.mentioned_page.map((item) =>
                pick(item, ['_id', 'basic_info', 'avatar'])
              ),
            })),
          total,
        };
      })
    );
};
const deleteReply = ({ replyID, commentID }) => {
  return Promise.all([
    Comment.findOneAndUpdate(
      { _id: ObjectId(commentID) },
      {
        $pull: {
          replies: ObjectId(replyID),
        },
        $set: {
          updated_at: Date.now(),
        },
      }
    ).lean(),
    Comment.findOneAndDelete({ _id: ObjectId(replyID) }).lean(),
  ]).then(([comment, reply]) => {
    let userID = reply.from_person;
    return Comment.find({
      post: ObjectId(comment.post),
      from_person: userID,
    }).then((data) => {
      if (!data.length) {
        return User.findOneAndUpdate(
          {
            _id: ObjectId(userID),
          },
          {
            $pull: {
              followed_posts: {
                post: ObjectId(comment.post),
              },
            },
          },
          {
            new: true,
          }
        )
          .lean()
          .then((data) => ({
            postID: comment.post,
            list: data.followed_posts,
          }));
      }
      return {
        postID: comment.post,
        list: null,
      };
    });
  });
};
const deleteComment = ({ commentID, postID }) => {
  return Promise.all([
    Post.findOneAndUpdate(
      { _id: ObjectId(postID) },
      {
        $pull: {
          comments: ObjectId(commentID),
        },
        $set: {
          updated_at: Date.now(),
        },
      }
    ).lean(),
    Comment.findOneAndDelete({ _id: ObjectId(commentID) }).lean(),
  ]).then(([post, comment]) => {
    let userID = comment.from_person;
    return Comment.find({
      post: ObjectId(postID),
      from_person: ObjectId(userID),
    }).then((data) => {
      if (!data.length) {
        return User.findOneAndUpdate(
          {
            _id: ObjectId(userID),
          },
          {
            $pull: {
              followed_posts: {
                post: ObjectId(postID),
              },
            },
          },
          { new: true }
        )
          .lean()
          .then((data) => data.followed_posts);
      }
      return null;
    });
  });
};
const deletePost = ({ postID }) => {
  return Promise.all([
    Post.findOneAndDelete({
      _id: ObjectId(postID),
    }).lean(),
    Comment.find({ post: ObjectId(postID) }).lean(),
    User.updateMany(
      {
        'followed_posts.post': ObjectId(postID),
      },
      {
        $pull: {
          followed_posts: {
            post: ObjectId(postID),
          },
        },
      }
    ),
  ]).then(([_post, comments]) => {
    // let replyIds = comments.reduce((total, cur) => [...total, ...cur.replies.map(each => ObjectId(each))], [])
    // console.log(replyIds)
    return Comment.deleteMany({
      $or: [
        {
          _id: {
            $in: comments.map((each) => ObjectId(each._id)),
          },
        },
      ],
    });
  });
};

const updateComment = ({ commentID, comment }) => {
  return Comment.findOneAndUpdate(
    {
      _id: ObjectId(commentID),
    },
    { $set: { ...comment, updated_at: Date.now() } },
    { new: true }
  ).lean();
};

const getPostByID = ({ postID }) => {
  return Post.findOne({
    _id: ObjectId(postID),
  }).lean();
};

const getLatestCommentsFromPost = ({ postID, nearest }) => {
  return Comment.find({
    post: ObjectId(postID),
    is_reply: false,
    created_at: {
      $gt: nearest,
    },
  }).sort({ created_at: -1 });
};

const getCommentByReply = ({ replyID }) => {
  return Comment.findOne({
    replies: ObjectId(replyID),
  }).populate('replies');
};

const getPostsByUserID = (getterID, userID, { skip, limit }) => {
  return Promise.all([
    User.findOne({
      _id: ObjectId(userID),
    }).lean(),
    User.findOne({
      _id: ObjectId(getterID),
    }).lean(),
  ])
    .then(([user, getter]) => {
      let isOwner = userID === getterID;
      let isFriend = !!user.friends.find(
        (each) => each.info.toString() === getterID
      );
      let {
        person_blocked: _person_blocked,
        blocked_posts: _blocked_posts,
      } = getter;
      // console.log(_friends)

      let person_blocked = _person_blocked.map((each) => ObjectId(each));
      let blocked_posts = _blocked_posts.map((each) => ObjectId(each));

      return Post.aggregate([
        {
          $match: {
            $and: [
              {
                belonged_group: {
                  $exists: false,
                },
              },
              {
                _id: {
                  $nin: blocked_posts,
                },
              },
              {
                belonged_person: {
                  $nin: person_blocked,
                },
              },
              {
                $or: [
                  {
                    ...(isOwner
                      ? {
                          belonged_person: ObjectId(userID),
                        }
                      : {
                          $and: [
                            {
                              belonged_person: ObjectId(userID),
                            },
                            {
                              ...(isFriend
                                ? {
                                    policy: {
                                      $in: ['PUBLIC', 'FRIENDS'],
                                    },
                                  }
                                : {
                                    policy: 'PUBLIC',
                                  }),
                            },
                          ],
                        }),
                  },
                  {
                    $and: [
                      {
                        tagged: ObjectId(userID),
                      },
                      {
                        $or: [
                          {
                            belonged_person: ObjectId(getterID),
                          },
                          {
                            policy: 'PUBLIC',
                          },
                          {
                            policy: 'FRIENDS',
                            belonged_person: {
                              $in: getter.friends.map((each) =>
                                ObjectId(each.info)
                              ),
                            },
                          },
                        ],
                      },
                    ],
                  },
                  {
                    $and: [
                      {
                        belonged_wall: ObjectId(userID),
                      },
                      {
                        $or: [
                          {
                            belonged_person: ObjectId(getterID),
                          },
                          {
                            policy: 'PUBLIC',
                          },
                          {
                            policy: 'FRIENDS',
                            belonged_person: {
                              $in: getter.friends.map((each) =>
                                ObjectId(each.info)
                              ),
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
        {
          $addFields: {
            love_size: {
              $size: '$reactions.love',
            },
            laugh_size: {
              $size: '$reactions.laugh',
            },
            wow_size: {
              $size: '$reactions.wow',
            },
            cry_size: {
              $size: '$reactions.cry',
            },
            angry_size: {
              $size: '$reactions.angry',
            },
            thump_up_size: {
              $size: '$reactions.thump_up',
            },
            thump_down_size: {
              $size: '$reactions.thump_down',
            },
          },
        },
        {
          $addFields: {
            comments_count: { $size: '$comments' },
            reaction_count: {
              $add: [
                '$love_size',
                '$laugh_size',
                '$wow_size',
                '$cry_size',
                '$cry_size',
                '$angry_size',
                '$thump_up_size',
                '$thump_down_size',
              ],
            },
          },
        },
        {
          $sort: {
            updated_at: -1,
          },
        },
        {
          $skip: Number(skip),
        },
        {
          $limit: Number(limit),
        },
        {
          $addFields: {
            file_ids: {
              $reduce: {
                input: '$files',
                initialValue: [],
                in: {
                  $setUnion: [
                    '$$value',
                    {
                      $map: {
                        input: '$$this.tagged',
                        as: 'el',
                        in: '$$el.related',
                      },
                    },
                  ],
                },
              },
            },
          },
        },

        {
          $lookup: {
            from: 'users',
            localField: 'file_ids',
            foreignField: '_id',
            as: 'file_tags',
          },
        },
        {
          $addFields: {
            files: {
              $map: {
                input: '$files',
                in: {
                  $mergeObjects: [
                    '$$this',
                    {
                      tagged: {
                        $map: {
                          input: '$$this.tagged',
                          in: {
                            $mergeObjects: [
                              '$$this',
                              {
                                related: {
                                  $arrayElemAt: [
                                    '$file_tags',
                                    {
                                      $indexOfArray: [
                                        '$file_ids',
                                        '$$this.related',
                                      ],
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
        { $project: { file_ids: 0, file_tags: 0 } },
        {
          $lookup: {
            from: 'users',
            localField: 'belonged_wall',
            foreignField: '_id',
            as: 'belonged_wall',
          },
        },
        {
          $lookup: {
            from: 'pages',
            localField: 'belonged_page',
            foreignField: '_id',
            as: 'belonged_page',
          },
        },
        {
          $lookup: {
            from: 'groups',
            localField: 'belonged_group',
            foreignField: '_id',
            as: 'belonged_group',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'belonged_person',
            foreignField: '_id',
            as: 'belonged_person',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'tagged',
            foreignField: '_id',
            as: 'tagged',
          },
        },
        {
          $addFields: {
            belonged_page: {
              $arrayElemAt: ['$belonged_page', 0],
            },
            belonged_group: {
              $arrayElemAt: ['$belonged_group', 0],
            },
            belonged_person: {
              $arrayElemAt: ['$belonged_person', 0],
            },
            belonged_wall: {
              $arrayElemAt: ['$belonged_wall', 0],
            },
            // "tagged": {
            //     $arrayElemAt: ["$tagged", 0]
            // },
          },
        },
        {
          $project: {
            love_size: 0,
            laugh_size: 0,
            wow_size: 0,
            cry_size: 0,
            angry_size: 0,
            thump_up_size: 0,
            thump_down_size: 0,
            comments: 0,
          },
        },
      ]);
    })
    .then((data) => {
      return data
        .map((each, i) => ({
          ...each,
          belonged_page: each.belonged_page
            ? pick(each.belonged_page, ['_id', 'avatar', 'basic_info'])
            : null,
          belonged_person: each.belonged_person
            ? pick(each.belonged_person, ['_id', 'avatar', 'basic_info'])
            : null,
          belonged_group: each.belonged_group
            ? pick(each.belonged_group, ['_id', 'basic_info'])
            : null,
          belonged_wall: each.belonged_wall
            ? pick(each.belonged_wall, ['_id', 'avatar', 'basic_info'])
            : null,
          tagged: each.tagged.map((tag) =>
            pick(tag, ['_id', 'avatar', 'basic_info'])
          ),
          score: (data.length - i) * 1.5,
        }))
        .sort((a, b) => b.score - a.score);
      // .map(each => omit(each, "score"))
    });
};

module.exports = {
  getPostsByUserID,
  getCommentByReply,
  getLatestCommentsFromPost,
  getAllPosts,
  createNewPost,
  updateFilesInPost,
  updatePost,
  updatePostReaction,
  getPostReactionByReactionKey,
  getPostComments,
  createNewCommentForPost,
  updatePostCommentReaction,
  createCommentReply,
  getCommentReplies,
  deleteReply,
  deleteComment,
  deletePost,
  updateComment,
  getPostByID,
};
