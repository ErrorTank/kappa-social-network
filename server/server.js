
// require('@tensorflow/tfjs-node');
require('dotenv').config({
  path:
    process.env.NODE_ENV === 'production' ? './env/prod.env' : './env/dev.env',
});
const https = require('https');
const fs = require('fs');
const path = require('path');
const createExpressServer = require('./config/express');
const app = createExpressServer({ useCors: true });
const dbManager = require('./config/db');
const createRoutes = require('./config/routes');
const createErrorHandlersMiddleware = require('./utils/error/error-handlers');
const { createSocketNamespaces } = require('./config/socket/socket');
const {loadFaceDetecsModels } = require("./config/face-detections");

dbManager
  .init()
  .then((dbs) => {
    const appDb = dbs[0];
    return require('./scripts/init-db-collections')(appDb);
  })
  .then((appDb) => {
    // require('./scripts/feedMarketplace');

    loadFaceDetecsModels();
    let environment = process.env.NODE_ENV;
    let server = https.createServer( {
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
      )
    },app);

    const namespacesIO = createSocketNamespaces(server, { db: appDb });
    app.use('/', createRoutes(appDb, namespacesIO));
    app.use(createErrorHandlersMiddleware);
    const port = process.env.PORT || 4000;
    server.listen(port, () => {
      console.log(`Server running on port: ${port}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
