const mongoose = require("mongoose");
const appDbUrl = process.env.DB_HOST;
let resolve1 = null;

let promise1 = (() => new Promise((resolve) => {
    resolve1 = resolve;
}))();



let appDb = mongoose.createConnection(appDbUrl, {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: true, useUnifiedTopology: true}, () => {

    console.log('\x1b[36m%s\x1b[32m', "Load all central instances successfully!");
    console.log('\x1b[36m%s\x1b[32m', "Connect to mongoDB successfully!", appDbUrl);
    resolve1();
});


module.exports = {
    initDatabase: () => {
        return Promise.all([
            promise1
        ]).then(() => {
            return null;
        }).catch((err) => {
            console.log("Cannot connect to db");
            return Promise.reject(err);
        });
    },
    getDbs: () => ({
        appDb
    })
};

