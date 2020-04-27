require("dotenv").config({path: process.env.NODE_ENV === "production" ? "./env/prod.env" :  "./env/dev.env"});
const http = require("http");
const fs = require("fs");
const path = require("path");
const createExpressServer = require("./config/express");
const app = createExpressServer({useCors: true});
const dbManager = require("./config/db");
const createRoutes = require("./config/routes");
const createErrorHandlersMiddleware = require("./utils/error/error-handlers");
const {createSocketNamespaces} = require("./config/socket/socket");

dbManager.init()
    .then((dbs) => {
        const appDb = dbs[0];
        return require("./scripts/init-db-collections")(appDb);
    })
    .then((appDb) => {
        let server = http.createServer(app);
        const namespacesIO = createSocketNamespaces(server, {db: appDb});
        app.use("/", createRoutes(appDb, namespacesIO));
        app.use(createErrorHandlersMiddleware);
        const port = process.env.PORT || 4000;
        server.listen(port, () => {
            console.log(`Server running on port: ${port}`)
        });
    })
    .catch(err => {
        console.error(err);
    });

