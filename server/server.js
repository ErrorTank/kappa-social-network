// require("dotenv").config({path: process.env.NODE_ENV === "production" ? "./env/prod.env" :  "./env/dev.env"});
const http= require("http");
const fs = require("fs");
const path = require("path");
const createExpressServer = require("./config/express");
const app = createExpressServer({useCors: true});
const {initDatabase} = require("./config/db");
const createRoutes = require("./config/routes");
const createErrorHandlersMiddleware = require("./utils/error/error-handlers");

initDatabase()
    .then((db) => {

        return {
            db
        }
    })

    .then(({db}) => {
    let server = http.createServer(app);
    app.use("/", createRoutes(db));
    app.use(createErrorHandlersMiddleware);
    const port = process.env.PORT || 2000;
    server.listen(port, () => {
        console.log(`Server running on port: ${port}`)
    });
}).catch(err => {
    console.error(err);
});

