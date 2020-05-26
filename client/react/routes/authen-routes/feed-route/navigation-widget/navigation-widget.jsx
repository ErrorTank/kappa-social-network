import React, {Component} from 'react';
import {userInfo} from "../../../../../common/states/common";
import {Avatar} from "../../../../common/avatar/avatar";

export class NavigationWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    routesNavigator = [
        {
            url: () => {
                let {_id} = userInfo.getState();
                return `/profile/${_id}`
            },
            render: () => {
                let user = userInfo.getState();
                return (
                    <div className="navigation-widget-row">
                        <div className="left-side">
                            <Avatar
                                user={user}
                            />
                        </div>
                        <div className="right-side">
                            {user.basic_info.username}
                        </div>
                    </div>
                )
            }
        }, {
            url: () => {
                return `/marketplace`
            },
            render: () => {
                return (
                    <div className="navigation-widget-row">
                        <div className="left-side">
                            <i className="fas fa-store"></i>
                        </div>
                        <div className="right-side">
                            Chợ mua bán
                        </div>
                    </div>
                )
            }
        }, {
            url: () => {
                return `/marketplace`
            },
            render: () => {
                return (
                    <div className="navigation-widget-row">
                        <div className="left-side">
                            <i className="fas fa-store"></i>
                        </div>
                        <div className="right-side">
                            Chợ mua bán
                        </div>
                    </div>
                )
            }
        },
    ];

    render() {
        return (
            <div className="navigation-widget">

            </div>
        );
    }
}
