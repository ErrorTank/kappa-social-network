import React from "react";
import {userInfo} from "../../../common/states/common";
import {Route, Redirect} from "react-router-dom"


export const mapRoleToDefaultPath = {
    "sv": "/",
    "gv": "/giao-vien",
    "bm": "/bo-mon",
    "pdt": "/manage",
    "admin": "/manage"
};

export const RoleFilterRoute = ({component: Component, roles = null, type, ...rest}) => {
    let getComp = (props) => {
        let info = userInfo.getState();

        if (info && roles && roles.length) {

            if (rest.condition ? !rest.condition() || !roles.includes(info.role) : !roles.includes(info.role)) {

                return (
                    <Redirect
                        to={{
                            pathname: mapRoleToDefaultPath[info.role]
                        }}
                    />
                )
            }
        }

        return (

            <Component {...props}/>


        )
    };
    return (
        <Route
            {...rest}
            render={props => getComp(props)}
        />
    );
};


