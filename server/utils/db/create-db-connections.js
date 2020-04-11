const mongoose = require("mongoose");

const createDbConnection = url => {
    let resolver = null;
    let executedPromise = (() => new Promise((resolve) => {
        resolver = resolve;
    }))();
    let connection = mongoose.createConnection(url, {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: true, useUnifiedTopology: true}, () => {
        console.log('\x1b[36m%s\x1b[32m',`Connect to mongoDB endpoint: ${url} successfully!`);
        resolver();
    });
    return executedPromise.then(() => connection)
};

const createDbConnections = dbUrls => {
    let promises = dbUrls.map(each => createDbConnection(each));
    return Promise.all(promises)
};

module.exports = createDbConnections;