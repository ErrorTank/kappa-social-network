const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const editorContentSchema = require('./common-schema/editor-content');
const { ReactionSchema } = require('./common-schema/reactions');

const postSchema = new Schema({
  policy: {
    type: String,
    enum: ['PERSONAL', 'FRIENDS', 'PUBLIC'],
    default: 'PUBLIC',
  },
  belonged_page: {
    type: ObjectId,
    ref: 'Page',
  },
  is_pinned: {
    type: Boolean,
    default: false,
  },
  is_approved: {
    type: Boolean,
    default: false,
  },
  listing: {
    type: ObjectId,
    ref: 'Listing',
  },
  belonged_group: {
    type: ObjectId,
    ref: 'Group',
  },
  belonged_person: {
    type: ObjectId,
    ref: 'User',
  },
  tagged: {
    default: [],
    type: [
      {
        type: ObjectId,
        ref: 'User',
      },
    ],
  },
  block_share: {
    type: Boolean,
    default: false,
  },
  reactions: ReactionSchema,
  share_count: {
    type: Number,
    default: 0,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  belonged_wall: {
    type: ObjectId,
    ref: 'User',
  },
  files: {
    default: [],
    type: [
      {
        path: String,
        name: String,
        origin_path: String,
        caption: String,
        tagged: {
          default: [],
          type: [
            {
              related: {
                type: ObjectId,
                ref: 'User',
              },
              ratioX: {
                type: Number,
              },
              ratioY: {
                type: Number,
              },
              boxWidthRatio: {
                type: Number,
              },
              boxHeightRatio: {
                type: Number,
              },
            },
          ],
        },
      },
    ],
  },
  ...editorContentSchema,
  shared_post: {
    type: ObjectId,
    ref: 'Post',
  },

  comment_disabled: {
    type: Boolean,
    default: false,
  },
  shared_page: {
    type: ObjectId,
    ref: 'Page',
  },
  comments: {
    default: [],
    type: [
      {
        type: ObjectId,
        ref: 'Comment',
      },
    ],
  },
});
const autoPopulateParent = function (next) {
  this.populate([
    {
      path: 'belonged_wall',
      model: 'User',
      select:
        '_id basic_info avatar last_active_at active notification_settings',
    },
    {
      path: 'belonged_person',
      model: 'User',
      select:
        '_id basic_info avatar last_active_at active notification_settings',
    },
    {
      path: 'tagged',
      model: 'User',
      select:
        '_id basic_info avatar last_active_at active notification_settings',
    },
    {
      path: 'mentions.related',
      model: 'User',
      select:
        '_id basic_info avatar last_active_at active notification_settings',
    },
    {
      path: 'shared_page',
      model: 'Page',
    },
    {
      path: 'files.tagged.related',
      model: 'User',
      select:
        '_id basic_info avatar last_active_at active notification_settings',
    },
    {
      path: 'listing',
      model: 'Listing',
      // populate: {
      //   path: 'listing.user',
      //   model: 'User',
      // },
      // select: '_id title make year model homeType decription price',
    },
    // {
    //   path: 'listing.user',
    //   model: 'User',
    //   select:
    //     '_id basic_info avatar last_active_at active notification_settings',
    // },
  ]);
  next();
};
postSchema
  .pre('find', autoPopulateParent)
  .pre('findOne', autoPopulateParent)
  .pre('findOneAndUpdate', autoPopulateParent);
postSchema.post('save', function (doc, next) {
  doc
    .populate([
      {
        path: 'belonged_wall',
        model: 'User',
        select:
          '_id basic_info avatar last_active_at active notification_settings',
      },
      {
        path: 'belonged_person',
        model: 'User',
        select:
          '_id basic_info avatar last_active_at active notification_settings',
      },
      {
        path: 'tagged',
        model: 'User',
        select:
          '_id basic_info avatar last_active_at active notification_settings',
      },
      {
        path: 'mentions.related',
        model: 'User',
        select:
          '_id basic_info avatar last_active_at active notification_settings',
      },
      {
        path: 'files.tagged.related',
        model: 'User',
        select:
          '_id basic_info avatar last_active_at active notification_settings',
      },
      {
        path: 'shared_page',
        model: 'Page',
      },
      {
        path: 'listing',
        model: 'Listing',
        // populate: {
        //   path: 'listing.user',
        //   model: 'User',
        // },
        // select: '_id title make year model homeType decription price',
      },
      // {
      //   path: 'listing.user',
      //   model: 'User',
      //   select:
      //     '_id basic_info avatar last_active_at active notification_settings',
      // },
    ])
    .execPopulate()
    .then(function () {
      next();
    });
});

module.exports = (db) => db.model('Post', postSchema);
