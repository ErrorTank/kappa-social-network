import React from "react";
import ReactDOM from "react-dom";
import {App} from "./routes/routes";
import {authenLoader} from "../sercurity/authen-loader";
import {registerServiceWorker} from "../register-service-worker";

registerServiceWorker()
    .then(() => authenLoader.init())
    .then(() => {
        ReactDOM.render(<App/>, document.getElementById("app"));
    });