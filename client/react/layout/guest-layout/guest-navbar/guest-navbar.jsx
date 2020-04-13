import React, {Component} from 'react';
import {Link} from "react-router-dom"
import {GuestNavbarLoginWidget} from "./guest-navbar-login-widget/guest-navbar-login-widget";

export class GuestNavbar extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        return (
            <div className="guest-navbar">
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
        );
    }
}
