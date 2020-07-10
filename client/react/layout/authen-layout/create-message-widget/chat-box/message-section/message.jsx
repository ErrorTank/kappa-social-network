import React, {Component} from 'react';
import classnames from "classnames"
import {userInfo} from "../../../../../../common/states/common";
import {getRenderableContentFromMessage} from "../../../../../../common/utils/editor-utils";
import {Tooltip} from "../../../../../common/tooltip/tooltip";
import {StatusAvatar} from "../../../../../common/status-avatar/status-avatar";
import {MessageState} from "../chat-box";
import {WithUserStatus} from "../../../../../common/user-statuts-subcriber/user-status-subscriber";
import moment from "moment";
import {Avatar} from "../../../../../common/avatar/avatar";
import {HyperLink} from "./hyper-link";
import {Link} from "react-router-dom"
import {messagesContainerUtilities} from "./message-section";
import {MessageFileDisplay} from "./message-file-display";
import {chatApi} from "../../../../../../api/common/chat-api";
import omit from "lodash/omit";
import {Progress} from "../../../../../common/progress/progress";
import {utilityApi} from "../../../../../../api/common/utilities-api";
import {isImageFile} from "../../../../../../common/utils/file-upload-utils";
import {ReplyContent} from "./reply-content/reply-content";
import {SpecialMessage} from "./special-message/special-message";
import {Emoji} from "emoji-mart";
import {ClickOutside} from "../../../../../common/click-outside/click-outside";
import {ReactionsWidget} from "../../../../../common/reactions-widget/reactions-widget";
import {getActiveReaction} from "../../../../../../common/utils/messenger-utils";


let Wrapper = (props) => props.links.length ? (
    <a href={props.links.length ? props.links[0] : ""} target={"_blank"} className={classnames("link-msg")}>
        {props.children}
    </a>
) : (
    <>
        {props.children}
    </>
);

export const MESSAGE_TYPES = {
    CASUAL: "CASUAL",
    KICK: "KICK",
    NICKNAME: "NICKNAME",
    EMOJI: "EMOJI",
}

export class Message extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploading: props.message.needUploadFile,
            percentage: 0,
            state: "pending",
            showAction: false
        }
        if (props.message.file && props.message.needUploadFile) {
            chatApi.sendFileMessage(props.chatRoomID, omit({
                ...props.message,
                sentBy: props.message.sentBy._id,
                file: props.message.file.file
            }, ["state", "temp", "needUploadFile"]), {
                onProgress: event => {
                    if (event.lengthComputable) {
                        this.setState({
                            state: "pending",
                            percentage: (event.loaded / event.total) * 100
                        });
                    }
                },
                onLoad: event => {
                    this.setState({
                        state: "done",
                        percentage: 100
                    });
                },
                onError: event => {
                    this.setState({
                        state: "error",
                        percentage: 0
                    });
                },
            })
                .then((data) => {
                    props.onUpload(data);
                })
        }
    }


    renderMessageState = (state) => {
        switch (state) {
            case MessageState.CACHED:
                return (
                    <span className="msg-state"></span>
                )
            case MessageState.SAVED:
                return (
                    <span className="msg-state">
                        <i className="fal fa-check"></i>
                    </span>
                )
            case MessageState.SENT:
                return (
                    <span className="msg-state full-fill">
                        <i className="fal fa-check"></i>
                    </span>
                )
        }
        return null;
    }

    onClickFile = () => {
        let {origin_path, name} = this.props.message.file;
        if (!isImageFile(name)) {
            this.setState({downloading: true});
            utilityApi.downloadFile(origin_path, name)
                .finally(() => {
                    this.setState({downloading: false});
                })
        }
    };

    changeReaction = (reaction) => {
        return this.props.onChangeReaction(reaction);
    };

    render() {
        let userID = userInfo.getState()._id;
        let {message, position, haveAvatar, isUserLastMessage} = this.props;
        let isOwned = message.sentBy._id === userID;

        let activeReaction = getActiveReaction(userID, message.reactions);
        return message.special !== MESSAGE_TYPES.CASUAL ? (
            <SpecialMessage
                message={message}
            />
        ) : (

            <div className={classnames("chat-message", position, {owned: isOwned, disabled: this.state.uploading})}
                 onMouseEnter={() => this.setState({showAction: true})}
                 onMouseLeave={() => this.setState({showAction: false})}
            >
                <div className="upper-panel">
                    {!isOwned && (
                        <div className="avatar">
                            {haveAvatar && (
                                <WithUserStatus
                                    userID={message.sentBy._id}
                                    status={{
                                        active: message.sentBy?.active,
                                        last_active_at: message.sentBy?.last_active_at
                                    }}
                                >
                                    {(userStatus) => {

                                        return (
                                            <StatusAvatar
                                                user={message.sentBy}
                                                active={userStatus.active}
                                            />
                                        )
                                    }}

                                </WithUserStatus>
                            )}

                        </div>
                    )}
                    {!message.is_deleted && isOwned && (
                        <MessageAction
                            show={this.state.showAction}
                            canRemove={isOwned}
                            isReverse={!isOwned}
                            onRemoveMessage={this.props.removeMessage}
                            onReply={this.props.onReply}
                            onChangeReaction={value => this.changeReaction(value)}
                            activeReaction={activeReaction}
                        />
                    )}


                    <div className={classnames("content-wrapper", {owned: isOwned})}>
                        {!message.is_deleted && message.reply_for && (
                            <>
                                <div className="reply-title">
                                    <i className="fas fa-reply"></i> {
                                    isOwned
                                        ? "Bạn" :
                                        <span className="high-light">{message.sentBy.basic_info.username}</span>
                                } phản hồi {
                                    message.sentBy._id !== message.reply_for.sentBy._id &&
                                    <span>tới {userID === message.reply_for.sentBy._id ? "bạn" : <span
                                        className="high-light">{message.reply_for.sentBy.basic_info.username}</span>}</span>
                                }
                                </div>
                                <div>
                                    <ReplyContent
                                        message={message.reply_for}
                                        isOwned={isOwned}
                                    />
                                </div>

                            </>
                        )}
                        <div className={classnames("message-renderable-content", {
                            emoji: message.emoji,
                            file: message.file,
                            owned: isOwned,
                            disabled: this.state.downloading,
                            isDeleted: message.is_deleted
                        })} onClick={() => message.file && this.onClickFile()}>
                            {message.is_deleted ? (
                                <div className="deleted-msg">
                                    {isOwned ? "Tin nhắn đã bị bạn xóa bỏ" : message.sentBy.basic_info.username + " đã xóa tin nhắn này"}
                                </div>
                            ) : message.emoji ? (
                                <div className="emoji-message">
                                    <Emoji set={'facebook'}
                                           emoji={message.emoji}
                                           skin={message.emoji?.skin || 1}
                                           size={35}

                                    />

                                    }}
                                </div>
                            ) : (
                                <>
                                    {this.state.uploading && (
                                        <div className="upload-loading">
                                            <div style={{height: "100%", position: "relative"}}>
                                                <Progress progress={this.state.percentage}
                                                          className={"message-file-loading"}/>
                                            </div>

                                        </div>
                                    )}
                                    {message.file ? (
                                        <MessageFileDisplay
                                            file={message.file}
                                            needUpload={message.needUploadFile}
                                        />
                                    ) : (
                                        <Wrapper links={message.hyperlinks}>
                                            <Tooltip
                                                className={"message-tooltip"}
                                                position={"top"}
                                                text={() => moment(message.created_at).format('hh:mm A')}
                                            >
                                                <div className="content">
                                                    {getRenderableContentFromMessage(message)}
                                                </div>

                                            </Tooltip>
                                            {!!message.hyperlinks.length && !message.temp && (
                                                <HyperLink
                                                    link={message.hyperlinks[0]}
                                                    onLoaded={() => {
                                                        // messagesContainerUtilities.createScrollLatest(true)();
                                                    }}
                                                />
                                            )}
                                        </Wrapper>
                                    )}
                                </>
                            )}

                        </div>
                    </div>


                    {(isOwned) && (
                        <div className="message-state">
                            {(message.seenBy.length === 0) && this.renderMessageState(message.state)}
                        </div>
                    )}
                    {!message.is_deleted && !isOwned && (
                        <MessageAction
                            canRemove={isOwned}
                            isReverse={!isOwned}
                            onReply={this.props.onReply}
                            onChangeReaction={value => this.changeReaction(value)}
                            activeReaction={activeReaction}
                            show={this.state.showAction}
                        />
                    )}
                </div>
                <div className="seen-panel">
                    {isUserLastMessage && message.seenBy.map((each) => (
                        <div className="seen-avatar" key={each._id}>
                            <Avatar
                                user={each}
                            />
                        </div>
                    ))}
                </div>
            </div>

        );
    }
}


class MessageAction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showReaction: false
        }
    }


    render() {
        let {canRemove = false, isReverse = false, onRemoveMessage, onReply, onChangeReaction, activeReaction, show} = this.props;
        let {showReaction} = this.state;
        console.log(showReaction)
        return (
            <>
                {showReaction && (
                    <div className="chat-reactions">
                        <ReactionsWidget
                            onSelect={onChangeReaction}
                            active={activeReaction}
                        />
                    </div>
                )}
                <div className={classnames("message-action", {show: show || showReaction})}>
                    {!isReverse ? (
                        <div className="message-action-wrapper">
                            {canRemove && (
                                <Tooltip
                                    position={"top"}
                                    className={"user-action-tooltip"}
                                    text={() => "Xóa"}

                                >
                                    <div className="action" onClick={onRemoveMessage}>
                                        <i className="fal fa-trash"></i>
                                    </div>
                                </Tooltip>
                            )}
                            <Tooltip
                                position={"top"}
                                className={"user-action-tooltip"}
                                text={() => "Trả lời"}
                            >
                                <div className="action" onClick={onReply}>
                                    <i className="fas fa-reply"></i>
                                </div>
                            </Tooltip>

                            <Tooltip
                                position={"top"}
                                className={"user-action-tooltip"}
                                text={() => "Biểu cảm"}
                                disabled={showReaction}
                            >
                                <ClickOutside onClickOut={() => showReaction && this.setState({showReaction: false})}>
                                    <div className="action"
                                         onClick={() => this.setState({showReaction: !showReaction})}>

                                        <i className="fal fa-smile"></i>
                                    </div>
                                </ClickOutside>

                            </Tooltip>
                        </div>
                    ) : (
                        <div className="message-action-wrapper">
                            <Tooltip
                                position={"top"}
                                className={"user-action-tooltip"}
                                text={() => "Biểu cảm"}
                                disabled={showReaction}
                            >
                                <ClickOutside onClickOut={() => showReaction && this.setState({showReaction: false})}>
                                    <div className="action"
                                         onClick={() => this.setState({showReaction: !showReaction})}>

                                        <i className="fal fa-smile"></i>
                                    </div>
                                </ClickOutside>
                            </Tooltip>

                            <Tooltip
                                position={"top"}
                                className={"user-action-tooltip"}
                                text={() => "Trả lời"}
                            >
                                <div className="action" onClick={onReply}>
                                    <i className="fas fa-reply"></i>
                                </div>
                            </Tooltip>
                            {canRemove && (
                                <Tooltip
                                    position={"top"}
                                    className={"user-action-tooltip"}
                                    text={() => "Xóa"}

                                >
                                    <div className="action" onClick={onRemoveMessage}>
                                        <i className="fal fa-trash"></i>
                                    </div>
                                </Tooltip>
                            )}


                        </div>
                    )}
                </div>
            </>
        )
    }
}


