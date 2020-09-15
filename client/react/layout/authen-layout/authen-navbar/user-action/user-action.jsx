import React, {Component} from 'react';
import classnames from "classnames";
import {getNamePrefix} from "../../../../../common/utils/common";
import {KComponent} from "../../../../common/k-component";
import {userInfo} from "../../../../../common/states/common";
import {ClickOutside} from "../../../../common/click-outside/click-outside";
import {UserSpecificAction} from "./user-specific-action";
import {Tooltip} from "../../../../common/tooltip/tooltip";
import {ChatBoxList} from "../chat-box-list/chat-box-list";
import {messengerApi} from "../../../../../api/common/messenger-api";
import {userApi} from "../../../../../api/common/user-api";
import {Notifications} from "../notifications/notifications";
import {Link} from "react-router-dom";

class UserActionDropdownable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        }
    }

    render() {
        let {toggleRender, dropdownRender, className} = this.props;
        return (
            <ClickOutside onClickOut={() => this.setState({show: false})}>
                <div className={classnames("user-action-dropdownable", className)}>
                    <div className={classnames("toggle", {active: this.state.show})}
                         onClick={() => this.setState({show: !this.state.show})}>
                        {toggleRender()}
                    </div>
                    {this.state.show && dropdownRender && (

                        <div className="dropdown">
                            {dropdownRender()}
                        </div>


                    )}
                </div>
            </ClickOutside>
        )
    }
}

export let userAction = {};

export class UserAction extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            unseen: [],
            notificationsCount: 0

        }
        let userID = userInfo.getState()._id;
        Promise.all([
            messengerApi.getUserUnseenMessagesCount(userID),
            userApi.getUnseenNotificationsCount()

        ]).then(([unseen, {count: notificationsCount}]) => {
            this.setState({unseen, notificationsCount})
        })


        userAction = {
            removeChatRoom: crID => this.setState({unseen: this.state.unseen.filter(each => each._id !== crID)})
        }
    }

    seenNotifications = (unseens) => {
        if (unseens.length) {
            userApi.seenNotifications(unseens.map(each => each._id))
                .then(() => this.setState({notificationsCount: this.state.notificationsCount - unseens.length}))
        }

    }

    render() {
        let user = userInfo.getState();

        return (
            <div className={classnames("user-action", {darkMode: this.props.darkMode})}>
                <UserActionDropdownable
                    toggleRender={() => (
                        <Tooltip
                            className={"user-action-tooltip"}
                            text={() => "Tạo Trang hoặc Nhóm"}
                        >
                            <div className="circle-action">
                                <i className="far fa-plus"></i>
                            </div>
                        </Tooltip>


                    )}

                />
                <div className="user-action-dropdownable">
                    <div className="toggle">
                        <div className="avatar-wrapper">
                            <Link to={`/user/${user._id}`}>
                                {user.avatar ? (
                                    <img src={user.avatar}/>

                                ) : (
                                    <div className="avatar-holder">

                                        <span>{getNamePrefix(user.basic_info.username.trim())}</span>


                                    </div>
                                )}
                            </Link>
                        </div>
                    </div>

                </div>

                <UserActionDropdownable
                    toggleRender={() => (
                        <Tooltip
                            className={"user-action-tooltip"}
                            text={() => "Chat"}
                        >
                            <div className="circle-action badge-action">
                                {!!this.state.unseen.length && (
                                    <div className="unseen-count">
                                        <span>{this.state.unseen.length}</span>

                                    </div>
                                )}
                                <i className="fas fa-comment"></i>
                            </div>
                        </Tooltip>


                    )}
                    dropdownRender={() => (
                        <ChatBoxList
                            darkMode={this.props.darkMode}
                            unseen={this.state.unseen}
                        />
                    )}

                />
                <UserActionDropdownable
                    className={"notifications-dd"}
                    toggleRender={() => (
                        <Tooltip
                            className={"user-action-tooltip"}
                            text={() => "Thông báo"}
                        >
                            <div className="circle-action  badge-action">
                                {this.state.notificationsCount > 0 && (
                                    <div className="unseen-count">
                                        <span>{this.state.notificationsCount}</span>

                                    </div>
                                )}
                                <i className="fas fa-bell"></i>
                            </div>
                        </Tooltip>
                    )}
                    dropdownRender={() => (
                        <Notifications
                            darkMode={this.props.darkMode}
                            onSeen={this.seenNotifications}
                        />
                    )}
                />
                <UserActionDropdownable
                    toggleRender={() => (
                        <Tooltip
                            className={"user-action-tooltip"}
                            text={() => "Tài khoản"}
                            position={"bottom-left"}
                        >
                            <div className="circle-action">
                                <i className="fas fa-caret-down"></i>
                            </div>
                        </Tooltip>
                    )}
                    dropdownRender={() => (
                        <UserSpecificAction
                            darkMode={this.props.darkMode}
                        />
                    )}
                />
            </div>
        );
    }
}
