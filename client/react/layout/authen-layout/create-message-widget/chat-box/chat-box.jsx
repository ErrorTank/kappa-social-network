import React, {Component} from 'react';
import {MessageBoxLayout} from "../../message-box-layout/message-box-layout";
import {MessageSection} from "./message-section/message-section";
import {MessageUtilities} from "./message-utilities/message-utilities";
import classnames from "classnames"
import {Tooltip} from "../../../../common/tooltip/tooltip";
import {messengerApi} from "../../../../../api/common/messenger-api";
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";
import {ThemeContext} from "../../../../context/theme-context";
import {StatusAvatar} from "../../../../common/status-avatar/status-avatar";
const moment = require("moment");
import { v4 as uuidv4 } from 'uuid';
import {WithUserStatus} from "../../../../common/user-statuts-subcriber/user-status-subscriber";
import {ChatBoxDropZone} from "./chat-box-dropzone";
import {chatApi} from "../../../../../api/common/chat-api";
import {userInfo} from "../../../../../common/states/common";
import {createStateHolder} from "../../../../../common/states/state-holder";
import omit from "lodash/omit"
import {KComponent} from "../../../../common/k-component";


export const MessageState = {
    CACHED: "CACHED",
    SAVED: "SAVED",
    SENT: "SENT",
}

export class ChatBox extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            chat_room_brief: null,

        };

        this.messageState = createStateHolder([]);

        messengerApi.getUserChatRoomBrief(props.userID)
            .then(({chat_room}) => {
                this.setState({chat_room_brief: chat_room});

            })
        this.onUnmount( this.messageState.onChange((nextState, oldState) => {
            this.forceUpdate();
        }));

    }

    startVideoCall = () => {

    };


    headerActions = [
        {
            icon: <i className="fas fa-video"></i>,
            onClick: () => this.startVideoCall(),
            toolTipContent: "Bắt đầu gọi video",
            className: "small-icon"
        },
        {
            icon: <i className="fas fa-phone-alt"></i>,
            onClick: () => this.startVoiceCall(),
            toolTipContent: "Bắt đầu gọi thoại",
            className: "small-icon"
        },
        {
            icon: <i className="far fa-window-minimize"></i>,
            onClick: () => this.props.onMinimize(),
            toolTipContent: "Thu nhỏ tab",
            className: "small-icon minimize"
        },
        {
            icon: <i className="fal fa-times"></i>,
            onClick: () => this.props.onClose(),
            toolTipContent: "Đóng tab"
        },
    ];

    handleSubmitChat = (chatState) => {
        let newMessageID = uuidv4();
        let newMessage = {
            _id: newMessageID,
            sentBy: userInfo.getState()._id,
            content: chatState.content,
            mentions: chatState.mentions,
            hyperlinks: chatState.hyperlinks,
            state: MessageState.CACHED
        }
        let currentMessages = this.messageState.getState();
        let newMessages = currentMessages.concat(newMessage);
        this.messageState.setState([...newMessages]);
        chatApi.sendMessage(this.state.chat_room_brief._id, omit(newMessage, ["_id", "state"]))
            .then(newServerMessage => {
                newMessages.splice(newMessages.length - 1, 1, {...newServerMessage});
                this.messageState.setState([...newMessages]);
            })

    };

    loadMessages = (chatRoomID) => {

        return chatApi.getChatRoomMessages(chatRoomID, {skip: this.messageState.getState().length})
            .then(messages => this.messageState.setState(messages))
    };

    render() {
        let {onClose, active, userInfo, userID} = this.props;
        let actions = userInfo ? this.headerActions : this.headerActions.slice(2);

        return (
            <WithUserStatus
                userID={userInfo?._id}
                status={{
                    active: userInfo?.active,
                    last_active_at: userInfo?.last_active_at
                }}
            >
                {userStatus => {

                    return (
                        <ThemeContext.Consumer>
                            {({darkMode}) => (
                                <MessageBoxLayout
                                    className={classnames({hide: !active})}
                                    renderHeader={() => (
                                        <div className="chat-box-header message-widget-header">
                                            <div className="left-panel">
                                                {userInfo ? (
                                                    <div className="chat-info">
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
                                                ) : (

                                                    <SkeletonTheme color={darkMode ? "#242526" : "#e3e3e3"}
                                                                   highlightColor={darkMode ? "#333436" : "#ebebeb"}>
                                                        <div className="loading-wrapper">
                                                            <Skeleton count={1} height={32} width={32} duration={1} circle={true}/>
                                                            <span style={{width:"5px"}}/>
                                                            <Skeleton count={1} height={20} width={80} duration={1}/>
                                                        </div>
                                                    </SkeletonTheme>

                                                )}
                                            </div>
                                            <div className="right-panel">
                                                <div className="actions">
                                                    {actions.map((each, i) => (
                                                        <Tooltip
                                                            text={() => each.toolTipContent}
                                                            position={"top"}
                                                            key={i}
                                                        >
                                                            <div className={classnames("icon-wrapper", each.className)}
                                                                 onClick={each.onClick}>
                                                                {each.icon}
                                                            </div>
                                                        </Tooltip>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    renderBody={() => (
                                        <div className="chat-box-body">
                                            <ChatBoxDropZone/>
                                            <MessageSection
                                                chatRoomID={this.state.chat_room_brief?._id}
                                                loadMessages={this.loadMessages}
                                                messages={this.messageState.getState()}
                                            />
                                            <MessageUtilities
                                                chatRoom={this.state.chat_room_brief}
                                                onSubmit={this.handleSubmitChat}
                                            />
                                        </div>
                                    )}
                                />
                            )}

                        </ThemeContext.Consumer>
                    )
                }}
            </WithUserStatus>

        );
    }
}
