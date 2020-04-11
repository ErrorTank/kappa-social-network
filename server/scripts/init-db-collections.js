const initDbCollections = appDb => {
    const User = require("../db/model/user")(appDb);
    const PersonPost = require("../db/model/person-post")(appDb);
    const PageType = require("../db/model/page-type")(appDb);
    const PagePost = require("../db/model/page-post")(appDb);
    const PageCategory = require("../db/model/page-category")(appDb);
    const Page = require("../db/model/page")(appDb);
    const Interest = require("../db/model/interest")(appDb);
    const GroupPost = require("../db/model/group-post")(appDb);
    const Group = require("../db/model/group")(appDb);
    const ChatRoom = require("../db/model/chat-room")(appDb);
    console.log("Initialize Db collections successfully!")
};

module.exports = initDbCollections;