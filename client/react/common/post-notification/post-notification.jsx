import React, {Component} from 'react';
import {getRenderableContentFromMessage} from "../../../common/utils/editor-utils";
import {Avatar} from "../avatar/avatar";
import {Emoji} from "emoji-mart";
import {userInfo} from "../../../common/states/common";
import moment from "moment";
import classnames from "classnames"
import {genderMatcher} from "../../layout/authen-layout/create-message-widget/chat-box/message-section/special-message/special-message";
import {REACTION_EMOJI_MAP} from "../reactions-widget/reactions-widget";

export class PostNotification extends Component {



    getRenderData = (data) => {
        let {notification_type} = data;
        let userID = userInfo.getState()._id;
        const dataMatcher = {

            "comment_on_followed_post": {
                getAvatarUser: () => data.comment.from_person,
                getReaction: () => null,
                getContent: () => (
                    <span>
                        <span className="high-light dark">{data.comment.from_person.basic_info.username}</span> đã bình luận về <span  className="high-light dark">bài viết</span> {data.post.belonged_person._id === userID ? "của bạn" : "mà bạn đang theo dõi"}: <span className="content">{getRenderableContentFromMessage(data.comment,  {disabledLink: true})}</span>
                    </span>
                ),
                getTime: () => data.comment.created_at
            },
            "mentioned_in_comment": {
                getAvatarUser: () => data.comment.from_person,
                getReaction: () => null,
                getContent: () => (
                    <span>
                        <span className="high-light dark">{data.comment.from_person.basic_info.username}</span> đã nhắc tới bạn trong một <span  className="high-light dark">bình luận</span>: <span className="content">{getRenderableContentFromMessage(data.comment, {disabledLink: true})}</span>
                    </span>
                ),
                getTime: () => data.comment.created_at
            },
            "mentioned_in_reply": {
                getAvatarUser: () => data.reply.from_person,
                getReaction: () => null,
                getContent: () => (
                    <span>
                        <span className="high-light dark">{data.reply.from_person.basic_info.username}</span> đã nhắc đến
                        <span  className="high-light dark"> bạn </span>trong một câu trả lời:
                        <span className="content"> {getRenderableContentFromMessage(data.reply, {disabledLink: true})}</span>
                    </span>
                ),
                getTime: () => data.reply.created_at
            },
            "reply_on_comment": {
                getAvatarUser: () => data.reply.from_person,
                getReaction: () => null,
                getContent: () => (
                    <span>
                        <span className="high-light dark">{data.reply.from_person.basic_info.username}</span> đã trả lời <span  className="high-light dark">bình luận</span> của
                        <span  className="high-light dark"> {data.comment.from_person._id === userID ? "bạn" : data.comment.from_person._id === data.comment.from_person._id ? genderMatcher[data.comment.from_person.basic_info.gender] : data.comment.from_person.basic_info.username}</span>:
                        <span className="content"> {getRenderableContentFromMessage(data.reply, {disabledLink: true})}</span>
                    </span>
                ),
                getTime: () => data.reply.created_at
            },
            "react_comment": {
                getAvatarUser: () => data.reacted_by,
                getReaction: () => REACTION_EMOJI_MAP[data.reaction],
                getContent: () => (
                    <span>
                        <span className="high-light dark">{data.reacted_by.basic_info.username}</span> đã bày tỏ cảm xúc tới <span  className="high-light dark">bình luận</span> của
                        <span  className="high-light dark"> bạn</span>
                    </span>
                ),
                getTime: () => data.comment.updated_at
            }
        };
        return dataMatcher[notification_type]

    }

    render() {
        let {notification, highLight, isPopup = true} = this.props;
        let {getAvatarUser, getReaction, getContent, getTime} = this.getRenderData(notification);
        let reaction = getReaction();
        return (
            <div className={classnames("post-notification", {active: highLight && !notification.is_seen})}>
                <div className="avatar-wrapper">
                    <Avatar user={getAvatarUser()}/>
                    {reaction && (
                        <div className="reaction">
                            <Emoji set={'facebook'}
                                   emoji={reaction}
                                   size={18}
                            />
                        </div>
                    )}
                </div>
                <div className="content-wrapper">
                    {getContent()}
                    {!isPopup && (
                        <div className="from-now">
                            {moment(getTime()).fromNow()}
                        </div>
                    )}

                </div>
            </div>
        );
    }
}

