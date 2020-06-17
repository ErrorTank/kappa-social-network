import React, {Component} from 'react';
import classnames from "classnames"
import {userInfo} from "../../../../../../common/states/common";
import {getRenderableContentFromMessage} from "../../../../../../common/utils/editor-utils";
import {Tooltip} from "../../../../../common/tooltip/tooltip";
import {StatusAvatar} from "../../../../../common/status-avatar/status-avatar";

export class Message extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        let userID = userInfo.getState()._id;
        let {message, position, haveAvatar} = this.props;
        let isOwned = message.sentBy._id === userID;
        return (
            <div className={classnames("chat-message",position, {owned: isOwned})}>
                <div className="upper-panel">
                    {!isOwned &&  (
                        <div className="avatar">
                            {haveAvatar && (
                                <StatusAvatar
                                    user={message.sentBy}
                                />
                            )}

                        </div>
                    )}
                    {isOwned && (
                        <MessageAction
                            canRemove={isOwned}
                            canReply={!!message.hyperlinks.length}
                            isReverse={!isOwned}
                        />
                    )}
                    <div className={classnames("message-renderable-content", {owned: isOwned})}>
                        {getRenderableContentFromMessage(message)}
                    </div>
                    {isOwned && (
                        <div className="message-state">

                        </div>
                    )}
                    {!isOwned && (
                        <MessageAction
                            canRemove={isOwned}
                            canReply={!!message.hyperlinks.length}
                            isReverse={!isOwned}
                        />
                    )}
                </div>
                <div className="seen-panel">

                </div>
            </div>
        );
    }
}

const MessageAction = ({canRemove = false, canReply = false, isReverse = false}) => {

    return (
        <div className="message-action">
            {!isReverse ? (
                <div className="message-action-wrapper">
                    <Tooltip
                        position={"top"}
                        className={"user-action-tooltip"}
                        text={() => "Thêm"}
                    >
                        <div className="action">
                            <i className="fal fa-ellipsis-v"></i>
                        </div>
                    </Tooltip>
                    {canReply && (
                        <Tooltip
                            position={"top"}
                            className={"user-action-tooltip"}
                            text={() => "Trả lời"}
                        >
                            <div className="action">
                                <i className="fas fa-reply"></i>
                            </div>
                        </Tooltip>
                    )}
                    {!canReply && (
                        <Tooltip
                            position={"top"}
                            className={"user-action-tooltip"}
                            text={() => "Gửi tiếp"}
                        >
                            <div className="action">
                                <i className="fal fa-external-link-square"></i>
                            </div>
                        </Tooltip>
                    )}
                    <Tooltip
                        position={"top"}
                        className={"user-action-tooltip"}
                        text={() => "Biểu cảm"}
                    >
                        <div className="action">
                            <i className="fal fa-smile"></i>
                        </div>
                    </Tooltip>
                </div>
            ) : (
                <div className="message-action-wrapper">
                    <Tooltip
                        position={"top"}
                        className={"user-action-tooltip"}
                        text={() => "Biểu cảm"}
                    >
                        <div className="action">
                            <i className="fal fa-smile"></i>
                        </div>
                    </Tooltip>
                    {!canReply && (
                        <Tooltip
                            position={"top"}
                            className={"user-action-tooltip"}
                            text={() => "Gửi tiếp"}
                        >
                            <div className="action">
                                <i className="fal fa-external-link-square"></i>
                            </div>
                        </Tooltip>
                    )}
                    {canReply && (
                        <Tooltip
                            position={"top"}
                            className={"user-action-tooltip"}
                            text={() => "Trả lời"}
                        >
                            <div className="action">
                                <i className="fas fa-reply"></i>
                            </div>
                        </Tooltip>
                    )}
                    <Tooltip
                        position={"top"}
                        className={"user-action-tooltip"}
                        text={() => "Thêm"}
                    >
                        <div className="action">
                            <i className="fal fa-ellipsis-v"></i>
                        </div>
                    </Tooltip>



                </div>
            )}
        </div>
    )
}
