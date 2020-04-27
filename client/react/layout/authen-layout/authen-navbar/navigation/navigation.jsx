import React, {Component} from 'react';
import {customHistory} from "../../../../routes/routes";
import classnames from "classnames"
import {Tooltip} from "../../../../common/tooltip/tooltip";

export class Navigation extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    };

    navigations = [
        {
            url: "/",
            icon: <i className="fal fa-home-lg-alt"></i>,
            tooltipText: "Trang chủ"
        }, {
            url: "/pages",
            icon: <i className="fal fa-flag"></i>,
            tooltipText: "Trang"
        }, {
            url: "/watch",
            icon: <i className="fal fa-video"></i>,
            tooltipText: "Xem video"
        }, {
            url: "/groups",
            icon: <i className="fal fa-users"></i>,
            tooltipText: "Nhóm"
        },
    ];

    render() {
        let {location} = customHistory;
        return (
            <div className={classnames("navigations",)}>
                {this.navigations.map((each, i) => {
                    return (
                        <Tooltip
                            key={each.url}
                            className={"navigation-tooltip"}
                            text={() => each.tooltipText}
                        >
                            <div className={classnames("navigation", {
                                active: each.url ? !Array.isArray(each.url) ?
                                    typeof each.url === "string" ?
                                        location.pathname === each.url :
                                        each.url.test(location.pathname) :
                                    !!each.url.find(each => typeof each === "string" ?
                                        location.pathname === each :
                                        location.pathname.match(each)) :
                                    false
                            })} >
                                <div className="icon-wrapper"
                                     onClick={() => customHistory.push(each.url)}
                                >
                                    {each.icon}
                                </div>
                            </div>
                        </Tooltip>
                    )
                })}
            </div>
        );
    }
}
