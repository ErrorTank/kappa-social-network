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


let Wrapper = (props) => props.links.length ? (
    <a href={props.links.length ? props.links[0] : ""} target={"_blank"}  className={classnames("link-msg")}>
        {props.children}
    </a>
)   : (
    <>
        {props.children}
    </>
);
export class Message extends Component {
    constructor(props) {
        super(props);
        this.state = {}
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



    render() {
        let userID = userInfo.getState()._id;
        let {message, position, haveAvatar, isUserLastMessage} = this.props;
        let isOwned = message.sentBy._id === userID;

        return (

            <div className={classnames("chat-message", position, {owned: isOwned})}>
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
                                        console.log(userStatus)
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
                    {isOwned && (
                        <MessageAction
                            canRemove={isOwned}
                            isReverse={!isOwned}
                        />
                    )}



                        <div className={classnames("message-renderable-content", {owned: isOwned})}>
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
                                            messagesContainerUtilities.createScrollLatest(true)();
                                        }}
                                    />
                                )}
                            </Wrapper>
                        </div>



                    {(isOwned) && (
                        <div className="message-state">
                            {(message.seenBy.length === 0) && this.renderMessageState(message.state)}
                        </div>
                    )}
                    {!isOwned && (
                        <MessageAction
                            canRemove={isOwned}
                            isReverse={!isOwned}
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

const MessageAction = ({canRemove = false, isReverse = false}) => {

    return (
        <div className="message-action">
            {!isReverse ? (
                <div className="message-action-wrapper">
                    {canRemove && (
                        <Tooltip
                            position={"top"}
                            className={"user-action-tooltip"}
                            text={() => "Xóa"}
                        >
                            <div className="action">
                                <i className="fal fa-trash"></i>
                            </div>
                        </Tooltip>
                    )}
                    <Tooltip
                        position={"top"}
                        className={"user-action-tooltip"}
                        text={() => "Trả lời"}
                    >
                        <div className="action">
                            <i className="fas fa-reply"></i>
                        </div>
                    </Tooltip>

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

                    <Tooltip
                        position={"top"}
                        className={"user-action-tooltip"}
                        text={() => "Trả lời"}
                    >
                        <div className="action">
                            <i className="fas fa-reply"></i>
                        </div>
                    </Tooltip>
                    {canRemove && (
                        <Tooltip
                            position={"top"}
                            className={"user-action-tooltip"}
                            text={() => "Xóa"}
                        >
                            <div className="action">
                                <i className="fal fa-trash"></i>
                            </div>
                        </Tooltip>
                    )}



                </div>
            )}
        </div>
    )
}
