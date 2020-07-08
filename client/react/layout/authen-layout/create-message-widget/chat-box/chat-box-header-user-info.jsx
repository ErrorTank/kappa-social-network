import React, {Component} from 'react';
import {StatusAvatar} from "../../../../common/status-avatar/status-avatar";
import {ClickOutside} from "../../../../common/click-outside/click-outside";
import {nicknameEditModal} from "../../../../common/nickname-edit-modal/nickname-edit-modal";
import {emojiEditModal} from "../../../../common/edit-emoji-modal/edit-emoji-modal";

const moment = require("moment");

export class ChatBoxHeaderUserInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showMenu: false
        }
    }

    editNickname = () => {
        nicknameEditModal.open({
            chatRoomID: this.props.chatRoomID
        })
    };

    changeDefaultEmoji = (emoji) => {

    };

    editDefaultEmoji = () => {
        emojiEditModal.open({
            onChange: this.changeDefaultEmoji
        })
    };

    actions = [
        {
            icon: <i className="far fa-pen"></i>,
            action: this.editNickname,
            label: "Biệt danh"
        },  {
            icon: <i className="far fa-smile"></i>,
            action: this.editDefaultEmoji,
            label: "Biểu cảm"
        },
    ]

    render() {
        let {userStatus, userInfo, nicknameMap} = this.props;
        let nickname = nicknameMap.find(each => each.related === userInfo._id)?.nickname;
        return (
            <div className="chat-box-header-user-info">
                <ClickOutside onClickOut={() => this.state.showMenu && this.setState({showMenu: false})}>
                    <div className="toggle" onClick={() => this.setState({showMenu: !this.state.showMenu})}>
                        {this.state.showMenu && (
                            <div className="chat-box-menu">
                                {this.actions.map(each => (
                                    <div className="menu-item" key={each.label} onClick={each.action}>
                                        <span className="icon">{each.icon}</span>
                                        <span className="label">{each.label}</span>
                                    </div>
                                ))}
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
                                <p className="username">{nickname || userInfo.basic_info.username}</p>
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
