import {Breadcrumbs} from "../../common/breadcrumbs/breadcrumbs";
import React from "react";

export const AuthenLayoutTitle = props => (
    <>
        <div className="main-content__header">
            <p className="authen-route-title">{props.title}</p>
        </div>
        <div className="main-content__body">
            {props.children}
        </div>
    </>
)