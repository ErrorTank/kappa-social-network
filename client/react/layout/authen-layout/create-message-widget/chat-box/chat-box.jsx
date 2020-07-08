import React, {Component} from 'react';
import {MessageBoxLayout} from "../../message-box-layout/message-box-layout";
import {messagesContainerUtilities, MessageSection} from "./message-section/message-section";
import {messageUtilities, MessageUtilities} from "./message-utilities/message-utilities";
import classnames from "classnames"
import {Tooltip} from "../../../../common/tooltip/tooltip";
import {messengerApi} from "../../../../../api/common/messenger-api";
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";
import {ThemeContext} from "../../../../context/theme-context";
import {v4 as uuidv4} from 'uuid';
import {WithUserStatus} from "../../../../common/user-statuts-subcriber/user-status-subscriber";
import {ChatBoxDropZone} from "./chat-box-dropzone";
import {chatApi} from "../../../../../api/common/chat-api";
import {userInfo} from "../../../../../common/states/common";
import {createStateHolder} from "../../../../../common/states/state-holder";
import omit from "lodash/omit"
import {KComponent} from "../../../../common/k-component";
import {messengerIO} from "../../../../../socket/sockets";
import {ChatBoxHeaderUserInfo} from "./chat-box-header-user-info";
import {MESSAGE_TYPES} from "./message-section/message";

export const MessageState = {
    CACHED: "CACHED",
    SAVED: "SAVED",
    SENT: "SENT",
};

export class ChatBox extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            chat_room_brief: null,
            nickname_map: [],
            default_emoji: null
        };

        this.messageState = createStateHolder([]);
        this.io = null;

        messengerApi.getUserChatRoomBrief(props.userID)
            .then(({chat_room}) => {
                this.io = messengerIO.getIOInstance();
                this.io.emit("join-chat-room", {
                    userID: userInfo.getState()._id,
                    chatRoomID: chat_room._id
                });
                this.io.on("push-to-seen-by", ({messageIDs, user}) => {
                    let scrollToLatest = messagesContainerUtilities.createScrollLatest();
                    let clone = [...this.messageState.getState()];
                    for (let i = 0; i < clone.length; i++) {
                        if (messageIDs.find(each => each === clone[i]._id)) {
                            clone[i].seenBy.push(user)
                        }
                    }

                    this.messageState.setState(clone).then(() => {
                        setTimeout(() => {
                            scrollToLatest();
                        })
                    });
                });
                this.io.on("change-message-state", ({messageIDs, state}) => {

                    let clone = [...this.messageState.getState()];
                    for (let i = 0; i < clone.length; i++) {
                        if (messageIDs.find(each => each === clone[i]._id)) {
                            clone[i].state = state;
                        }
                    }
                    this.messageState.setState(clone);
                });
                this.io.on("update-nicknames", ({data}) => {
                   this.setState({nickname_map: data})
                });
                this.io.on("update-default-emoji", ({data}) => {
                    this.setState({default_emoji: data})
                });
                this.io.on("remove-message", ({messageID}) => {

                   this.removeMessage(messageID)
                });
                this.io.on("new-message", ({message, senderID, forceUpdate = false}) => {
                    let scrollToLatest = messagesContainerUtilities.createScrollLatest();
                    let isOwned = userInfo.getState()._id === senderID;

                    if (forceUpdate || !isOwned) {
                        let newMessages = this.messageState.getState();
                        this.messageState.setState(newMessages.concat(message)).then(() => {
                            setTimeout(() => {
                                messagesContainerUtilities.increaseUnSeenCount();
                                scrollToLatest();
                            })
                        });
                        if(!isOwned){
                            this.io.emit("received-message", {
                                userID: userInfo.getState()._id,
                                chatRoomID: chat_room._id,
                                messageID: message._id
                            })
                        }

                    }

                });
                this.setState({chat_room_brief: chat_room, nickname_map: chat_room.involve_person, default_emoji: chat_room.default_emoji});

            });
        this.onUnmount(this.messageState.onChange((nextState, oldState) => {
            this.forceUpdate();
        }));

    }

    componentWillUnmount() {
        if (this.io) {
            this.io.off("change-message-state");
            this.io.off("update-default-emoji");
            this.io.off("update-nicknames");
            this.io.off("new-message");
            this.io.off("update-message");
            this.io.off("push-to-seen-by");
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

    createTempMessage = ({state = {}, needUploadFile = false, file = null}) => {
        let newMessageID = uuidv4();
        return {
            _id: newMessageID,
            sentBy: {_id: userInfo.getState()._id},
            content: state.content || "",
            mentions: state.mentions || [],
            special: MESSAGE_TYPES.CASUAL,
            hyperlinks: state.hyperlinks || [],
            state: MessageState.CACHED,
            seenBy: [],
            temp: true,
            needUploadFile,
            file,
            emoji: state.emoji || null,
            reply_for:  state.reply ? {
                file: state.reply.file,
                content: state.reply.content,
                sentBy: state.reply.sentBy
            } : null
        }
    };

    handleSubmitChat = (chatState) => {
        let newMessage = null;
        if(chatState.content){
             newMessage = this.createTempMessage({state: chatState});
        }

        let fileMessages = chatState.files.map((each) => this.createTempMessage({file: each, needUploadFile: true}));
        let currentMessages = this.messageState.getState();
        let newMessages = currentMessages.concat(newMessage ? [newMessage, ...fileMessages] : fileMessages);
        console.log(newMessages);

        let scrollToLatest = messagesContainerUtilities.createScrollLatest();
        this.messageState.setState([...newMessages]).then(() => {
            setTimeout(() => {
                scrollToLatest(true);
            })
        });
        if(newMessage){
            chatApi.sendMessage(this.state.chat_room_brief._id, omit({
                ...newMessage,
                sentBy: newMessage.sentBy._id,
                reply_for: newMessage.reply_for ? {
                    ...newMessage.reply_for,
                    sentBy: newMessage.reply_for.sentBy._id
                } : null
            }, ["state", "temp", "needUploadFile", "file"]))
                .then(newServerMessage => {
                    let msgs = [...this.messageState.getState()];
                    let replaceIndex = msgs.findIndex(each => each._id === newServerMessage.oldID);
                    msgs.splice(replaceIndex, 1, omit(newServerMessage, "oldID"));
                    this.messageState.setState([...msgs])
                })
        }


    };

    changeAllSavedMassageToSent = (messages) => {
        let userID = userInfo.getState()._id;
        let savedMessage = messages.filter(each => each.sentBy._id !== userID && each.state === "SAVED");
        if (savedMessage.length) {
            chatApi.changeSavedMessagesToSent(this.state.chat_room_brief._id, savedMessage)
        }

    };

    loadMessages = (chatRoomID) => {
        let oldMsgs = this.messageState.getState();
        return chatApi.getChatRoomMessages(chatRoomID, {skip: oldMsgs.length})
            .then(messages => {
                return this.messageState.setState(messages.concat(oldMsgs)).then(() => {
                    this.changeAllSavedMassageToSent(messages);
                });
            })
    };

    onUploadMessage = (newMessage) => {
        let msgs = [...this.messageState.getState()];
        let replaceIndex = msgs.findIndex(each => each._id === newMessage.oldID);
        msgs.splice(replaceIndex, 1, omit(newMessage, "oldID"));
        return this.messageState.setState([...msgs])
    };

    emitSeenMessageEvent = () => {
        let messages = this.messageState.getState();
        let userID = userInfo.getState()._id;
        let unseenMessages = messages.filter(each => each.sentBy._id !== userID && each.state === "SENT" && !each.seenBy.find(seen => seen._id === userID));
        if (unseenMessages.length) {
            chatApi.seenMessages(this.state.chat_room_brief._id, unseenMessages)
        }
    };

    removeMessage = (messageID) => {
        let scrollToLatest = messagesContainerUtilities.createScrollLatest();
        let messages = [...this.messageState.getState()];
        for(let msg of messages){
            if(msg._id === messageID){
                msg.is_deleted = true;
                break;
            }
        }
        return this.messageState.setState(messages).then(() => {
            scrollToLatest();
            return true;
        });
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
                                                     <ChatBoxHeaderUserInfo
                                                        userInfo={userInfo}
                                                        userStatus={userStatus}
                                                        chatRoomID={this.state.chat_room_brief?._id}
                                                        nicknameMap={this.state.nickname_map}
                                                        defaultEmoji={this.state.default_emoji}
                                                     />
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
                                                chatRoom={this.state.chat_room_brief}
                                                messages={this.messageState.getState()}
                                                isGroupChat={this.state.chat_room_brief?.is_group_chat}
                                                onUpload={this.onUploadMessage}
                                                removeMessage={this.removeMessage}
                                                onReply={messageUtilities.openReplyPanel}
                                            />
                                            <MessageUtilities
                                                chatRoom={this.state.chat_room_brief}
                                                onSubmit={this.handleSubmitChat}
                                                onFocusEditor={this.emitSeenMessageEvent}
                                                defaultEmoji={this.state.default_emoji}
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
