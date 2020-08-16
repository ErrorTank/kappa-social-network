import React from "react";
import ReactDOM from "react-dom";
import {App} from "./routes/routes";
import {authenLoader} from "../sercurity/authen-loader";
import {registerServiceWorker} from "../register-service-worker";
import 'draft-js-mention-plugin/lib/plugin.css';
import 'draft-js-emoji-plugin/lib/plugin.css';
import 'draft-js/dist/Draft.css';
import 'emoji-mart/css/emoji-mart.css'



registerServiceWorker()
    .then(() => authenLoader.init())
    .then(async () => {

        ReactDOM.render(<App/>, document.getElementById("app"));
    });