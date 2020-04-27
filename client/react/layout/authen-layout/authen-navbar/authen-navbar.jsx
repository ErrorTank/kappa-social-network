import React, {Component} from 'react';
import {Link} from "react-router-dom";
import classnames from "classnames";
import {NavbarGlobalSearch} from "./navbar-global-search/navbar-global-search";
import {Navigation} from "./navigation/navigation";

export class AuthenNavbar extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    navigations = [
        {
            url: "/",
            icon: <i className="fal fa-home-lg-alt"></i>,
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
        let {showNotificationPrompt, ...rest} = this.props;
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
                            <NavbarGlobalSearch
                                {...rest}
                            />
                        </div>
                    </div>
                    <div className="authen-navbar-center">
                        <Navigation/>
                    </div>
                    <div className="authen-navbar-right">
                        <div className="feed-navigation">

                        </div>
                    </div>
                </div>
            </div>

        );
    }
}
