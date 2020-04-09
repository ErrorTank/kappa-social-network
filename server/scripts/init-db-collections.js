const initDbCollections = appDb => {
    const User = require("../db/model/user")(appDb);
};

module.exports = initDbCollections;