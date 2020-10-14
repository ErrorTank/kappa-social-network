// require('@tensorflow/tfjs-node');
require("dotenv").config({
  path:
    process.env.NODE_ENV === "production" ? "./env/prod.env" : "./env/dev.env",
});

const https = require("https");

const fs = require("fs");
const path = require("path");

const createExpressServer = require("./config/express");
const app = createExpressServer({ useCors: true });
const dbManager = require("./config/db");
const createRoutes = require("./config/routes");
const createErrorHandlersMiddleware = require("./utils/error/error-handlers");
const { createSocketNamespaces } = require("./config/socket/socket");

dbManager
  .init()
  .then((dbs) => {
    const appDb = dbs[0];
    return require("./scripts/init-db-collections")(appDb);
  })
  .then((appDb) => {
    // require('./scripts/feedMarketplace');
    //require("./scripts/feedDatingProfile.js");
    let environment = process.env.NODE_ENV;
    const port = process.env.PORT || 4000;
    const server = https.createServer(
      {
        key: fs.readFileSync(
          path.join(
            __dirname,
            `./ssl/${environment}/${process.env.SSL_KEY_PATH}`
          )
        ),
        cert: fs.readFileSync(
          path.join(
            __dirname,
            `./ssl/${environment}/${process.env.SSL_CRT_PATH}`
          )
        ),
      },
      app
    );
    const nampespacesIO = createSocketNamespaces(server, { db: appDb });
    app.use("/", createRoutes(appDb, nampespacesIO));
    app.use(createErrorHandlersMiddleware);

    server.listen(port, () => {
      console.log(`Server running on port: ${port}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
