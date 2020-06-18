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
import {v4 as uuidv4} from 'uuid';
import {WithUserStatus} from "../../../../common/user-statuts-subcriber/user-status-subscriber";
import {ChatBoxDropZone} from "./chat-box-dropzone";
import {chatApi} from "../../../../../api/common/chat-api";
import {userInfo} from "../../../../../common/states/common";
import {createStateHolder} from "../../../../../common/states/state-holder";
import omit from "lodash/omit"
import {KComponent} from "../../../../common/k-component";
import {messengerIO} from "../../../../../socket/sockets";


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
        this.io = null

        messengerApi.getUserChatRoomBrief(props.userID)
            .then(({chat_room}) => {
                this.io = messengerIO.getIOInstance();
                this.io.emit("join-chat-room", {
                    userID: userInfo.getState()._id,
                    chatRoomID: chat_room._id
                });
                this.io.on("change-message-state", ({messageIDs, state}) => {

                    let clone = [...this.messageState.getState()];
                    for (let i = 0; i < clone.length; i++) {
                        if (messageIDs.find(each => each === clone[i]._id)) {
                            clone[i].state = state;
                        }
                    }
                    this.messageState.setState(clone);
                })
                this.io.on("new-message", ({message}) => {

                    if (userInfo.getState()._id !== message.sentBy._id) {
                        let newMessages = this.messageState.getState();
                        this.messageState.setState(newMessages.concat(message))
                        this.io.emit("received-message", {
                            userID: userInfo.getState()._id,
                            chatRoomID: chat_room._id,
                            messageID: message._id
                        })
                    }

                })
                this.setState({chat_room_brief: chat_room});

            })
        this.onUnmount(this.messageState.onChange((nextState, oldState) => {
            this.forceUpdate();
        }));

    }

    componentWillUnmount() {
        if (this.io) {
            this.io.off("change-message-state");
            this.io.off("new-message");
            this.io.emit("left-chat-room", {
                chatRoomID: this.state.chat_room_brief._id,
                userID: userInfo.getState()._id
            });
        }
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
            sentBy: {_id: userInfo.getState()._id},
            content: chatState.content,
            mentions: chatState.mentions,
            hyperlinks: chatState.hyperlinks,
            state: MessageState.CACHED,
            seenBy: [],

        }
        let currentMessages = this.messageState.getState();
        let newMessages = currentMessages.concat(newMessage);
        console.log(newMessages)
        this.messageState.setState([...newMessages]);
        chatApi.sendMessage(this.state.chat_room_brief._id, omit({
            ...newMessage,
            sentBy: newMessage.sentBy._id
        }, ["_id", "state"]))
            .then(newServerMessage => {
                let msgs = newMessages.slice(0, newMessages.length - 1).concat({...newServerMessage});
                console.log(msgs)
                this.messageState.setState(msgs);
            })

    };

    changeAllSavedMassageToSent = (messages) => {
        let userID = userInfo.getState()._id;
        let savedMessage = messages.filter(each => each.sentBy._id !== userID && each.state === "SAVED");
        if (savedMessage.length) {
            chatApi.changeSavedMessagesToSent(this.state.chat_room_brief._id, savedMessage)
        }

    };

    loadMessages = (chatRoomID) => {

        return chatApi.getChatRoomMessages(chatRoomID, {skip: this.messageState.getState().length})
            .then(messages => {
                return this.messageState.setState(messages).then(() => {
                    this.changeAllSavedMassageToSent(messages);
                });
            })
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
                                                            <Skeleton count={1} height={32} width={32} duration={1}
                                                                      circle={true}/>
                                                            <span style={{width: "5px"}}/>
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
                                                isGroupChat={this.state.chat_room_brief?.is_group_chat}
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
