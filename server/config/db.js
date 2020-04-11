const mongoose = require("mongoose");
const createDbConnections = require("../utils/db/create-db-connections");


const createDbManager = () => {
    let dbs = [];
    return {
        init: () => {
            return createDbConnections([process.env.DB_HOST])
                .then(connections => {
                    dbs = connections;
                    return dbs;
                })
                .catch((err) => {
                    console.log("Cannot connect to db!");
                    return Promise.reject(err);
                });
        },
        getConnections: () => dbs
    }
};

const dbManager = createDbManager();

module.exports = dbManager;
