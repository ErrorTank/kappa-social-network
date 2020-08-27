require('dotenv').config({
    path:
        process.env.NODE_ENV === 'production' ? './env/prod.env' : './env/dev.env',
});
// require('https').globalAgent.options.ca = require('ssl-root-cas/latest').create();
// require('ssl-root-cas/latest').inject();
const https = require('https');

const fs = require('fs');
const path = require('path');

const createExpressServer = require('./express');
const app = createExpressServer({useCors: true});
const apiRoutes = require('./api');
const createErrorHandlersMiddleware = require('./utils/error/error-handlers');
const {loadFaceDetecsModels} = require("./face-detections");
const {setupWorkerProcesses} = require("./setup-worker")
const cluster = require("cluster")

if(cluster.isMaster && process.env.CLUSTER_ENABLED === '1'){
    setupWorkerProcesses();
}else{
    loadFaceDetecsModels();

    let environment = process.env.NODE_ENV;
    const port = process.env.PORT || 5000;


    const server = https.createServer({
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
    }, app);




    app.use('/api', apiRoutes());
    app.use(createErrorHandlersMiddleware);

    server.listen(port, () => {

        console.log(`Cluster server running on port: ${port}`);
    });
}