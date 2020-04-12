const feed = require("./feed");

const initDbCollections = appDb => {
    const User = require("../db/model/user")(appDb);
    const PersonPost = require("../db/model/person-post")(appDb);
    const PagePost = require("../db/model/page-post")(appDb);
    const PageCategory = require("../db/model/page-category")(appDb);
    const MarketItem = require("../db/model/market-item")(appDb);
    const Page = require("../db/model/page")(appDb);
    const GroupPost = require("../db/model/group-post")(appDb);
    const Group = require("../db/model/group")(appDb);
    const ChatRoom = require("../db/model/chat-room")(appDb);
    console.log("Initialize Db collections successfully!")
    return feed({
        PageCategory,
    });
};

module.exports = initDbCollections;