import React, {Component} from 'react';
import {StatusAvatar} from "../../../../common/status-avatar/status-avatar";
import {ClickOutside} from "../../../../common/click-outside/click-outside";

const moment = require("moment");

export class ChatBoxHeaderUserInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showMenu: false
        }
    }

    render() {
        let {userStatus, userInfo} = this.props;
        console.log(this.state.showMenu)
        return (
            <div className="chat-box-header-user-info">
                <ClickOutside onClickOut={() => this.state.showMenu && this.setState({showMenu: false})}>
                    <div className="toggle" onClick={() => this.setState({showMenu: !this.state.showMenu})}>
                        {this.state.showMenu && (
                            <div className="chat-box-menu">

                            </div>


                        )}
                        <div className={"avatar-wrapper"}>
                            <StatusAvatar
                                active={userStatus.active}
                                user={userInfo}
                            />
                        </div>
                        <div className="user-status">
                            <div className="wrapper">
                                <p className="username">{userInfo.basic_info.username}</p>
                                <p className="status">{userStatus.active ? "Đang hoạt động" : moment(userStatus.last_active_at).fromNow()}</p>
                            </div>
                        </div>
                        <i className="fal fa-angle-down"></i>
                    </div>
                </ClickOutside>
            </div>
        );
    }
}
