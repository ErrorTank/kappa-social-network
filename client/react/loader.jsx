import React from "react";
import ReactDOM from "react-dom";
import {MainRoute} from "./routes/routes";
import {authenLoader} from "../sercurity/authen-loader";


authenLoader.init().then(() => {
    ReactDOM.render(<MainRoute/>, document.getElementById("app"));
});