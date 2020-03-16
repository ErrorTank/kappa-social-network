import React from "react";
import {userInfo} from "../../../common/states/common";
import {Route, Redirect} from "react-router-dom"
import {TrackLocation} from "../../common/location-tracker";
import {authenCache} from "../../../common/cache/authen-cache";
import {AuthenLayout} from "../../layout/authen-layout/authen-layout";

export const AuthenRoute = ({component: Component, ...rest}) => {
    let getComp = (props) => {
        if (!authenCache.getAuthen()) {
            return (
                <Redirect to={{pathname: "/login"}}/>
            )
        }

        return (

                <AuthenLayout>
                    {() => (
                        <Component {...props}/>
                    )}
                </AuthenLayout>

        )
    };
    return (
        <Route
            {...rest}
            render={props => {
                return (
                    <TrackLocation
                        location={window.location.href.replace(document.location.origin, "")}
                        render={() => getComp(props)}
                    />


                )
            }}
        />
    );
};


