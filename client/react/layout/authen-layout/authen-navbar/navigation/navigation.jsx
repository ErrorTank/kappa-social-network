import React, {Component} from 'react';
import {customHistory} from "../../../../routes/routes";
import classnames from "classnames"

export class Navigation extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    };

    navigations = [
        {
            url: "/",
            icon: <i className="fal fa-home-lg-alt"></i>,
        }, {
            url: "/pages",
            icon: <i className="fal fa-flag"></i>,
        }, {
            url: "/watch",
            icon: <i className="fal fa-video"></i>,
        }, {
            url: "/groups",
            icon: <i className="fal fa-users"></i>,
        },
    ];

    render() {
        let {location} = customHistory;
        return (
            <div className={classnames("navigations",)}>
                {this.navigations.map((each, i) => {
                    return (
                        <div className={classnames("navigation", {
                            active: each.url ? !Array.isArray(each.url) ?
                                typeof each.url === "string" ?
                                    location.pathname === each.url :
                                    each.url.test(location.pathname) :
                                !!each.url.find(each => typeof each === "string" ?
                                    location.pathname === each :
                                    location.pathname.match(each)) :
                                false
                        })} key={each.url}>
                            <div className="icon-wrapper"
                                 onClick={() => customHistory.push(each.url)}
                            >
                                {each.icon}
                            </div>
                        </div>
                    )
                })}
            </div>
        );
    }
}
