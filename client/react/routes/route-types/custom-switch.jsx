import React from "react";
import {Switch} from "react-router-dom"
import {Redirect} from "react-router-dom";

export const CustomSwitch = (props) => (
    <Switch>
        {props.children}
        <Redirect to={{state: {error: true}}}/>
    </Switch>
);