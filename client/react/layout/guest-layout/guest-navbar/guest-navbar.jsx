import React, {Component} from 'react';
import {Link} from "react-router-dom"
import {GuestNavbarLoginWidget} from "./guest-navbar-login-widget/guest-navbar-login-widget";
import {NotificationStateContext} from "../../../routes/routes";
import classnames from "classnames";

export class GuestNavbar extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <NotificationStateContext.Consumer>
                {showNotificationPrompt => {
                    return (
                        <div className={classnames("guest-navbar", {"stay-down": showNotificationPrompt})}>
                            <div className="container">
                                <div className="guest-navbar-wrapper">
                                    <div className="guest-navbar-left">
                                        <Link className="app-brand" to={"/"} title={"Về trang chủ Kappa"}>
                                            Kappa
                                        </Link>
                                    </div>
                                    <div className="guest-navbar-right">
                                        <GuestNavbarLoginWidget/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }}

            </NotificationStateContext.Consumer>
        );
    }
}
