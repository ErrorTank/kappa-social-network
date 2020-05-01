import React, {Component} from 'react';
import {Link} from "react-router-dom";
import classnames from "classnames";
import {NavbarGlobalSearch} from "./navbar-global-search/navbar-global-search";
import {Navigation} from "./navigation/navigation";
import {UserAction} from "./user-action/user-action";

export class AuthenNavbar extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    navigations = [
        {
            icon: <i className="fal fa-home-lg-alt"></i>,
            url: "/",
        },{
            url: "/pages",
            icon: <i className="fal fa-flag"></i>,
        },{
            url: "/watch",
            icon: <i className="fal fa-home-lg-alt"></i>,
        },{
            url: "/",
            icon: <i className="fal fa-home-lg-alt"></i>,
        },
    ];

    render() {
        let {showNotificationPrompt, darkMode, ...rest} = this.props;
        return (
            <div className={classnames("authen-navbar", {"stay-top": !showNotificationPrompt, darkMode})}>
                <div className="authen-navbar-container">
                    <div className="authen-navbar-left">
                        <div className="app-brand-container">
                            <Link className="app-brand" to={"/"} title={"Về trang chủ Kappa"}>
                                Kappa
                            </Link>
                        </div>
                        <div className="search-container">
                            <NavbarGlobalSearch
                                {...rest}
                                darkMode={darkMode}
                            />
                        </div>
                    </div>
                    <div className="authen-navbar-center">
                        <Navigation
                            darkMode={darkMode}
                        />
                    </div>
                    <div className="authen-navbar-right">
                        <UserAction  darkMode={darkMode}/>
                    </div>
                </div>
            </div>

        );
    }
}
