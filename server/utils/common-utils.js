const crypto = require("crypto");

const getRandomToken = l => {
    return crypto.randomBytes(l).toString('hex');
};

const asynchronized = (fn) => {
    return new Promise(fn)
};

module.exports = {
    getRandomToken,
    asynchronized
};