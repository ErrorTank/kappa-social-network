import React, {Component} from 'react';
import {Link} from "react-router-dom";
import classnames from "classnames";
import {NavbarGlobalSearch} from "./navbar-global-search/navbar-global-search";

export class AuthenNavbar extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        let {showNotificationPrompt} = this.props;
        return (
            <div className={classnames("authen-navbar", {"stay-top": !showNotificationPrompt})}>
                <div className="authen-navbar-container">
                    <div className="authen-navbar-left">
                        <div className="app-brand-container">
                            <Link className="app-brand" to={"/"} title={"Về trang chủ Kappa"}>
                                Kappa
                            </Link>
                        </div>
                        <div className="search-container">
                            <NavbarGlobalSearch/>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}
