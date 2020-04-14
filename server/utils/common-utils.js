const crypto = require("crypto");

const getRandomToken = l => {
    return crypto.randomBytes(l).toString('hex');
};

module.exports = {
    getRandomToken
};