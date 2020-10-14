import React, {Component} from 'react';
import {getRenderableContentFromMessage} from "../../../common/utils/editor-utils";
import {Avatar} from "../avatar/avatar";
import {Emoji} from "emoji-mart";
import {userInfo} from "../../../common/states/common";
import moment from "moment";
import classnames from "classnames"
import {genderMatcher} from "../../layout/authen-layout/create-message-widget/chat-box/message-section/special-message/special-message";
import {REACTION_EMOJI_MAP} from "../reactions-widget/reactions-widget";
import {customHistory} from "../../routes/routes";
import {Button} from "../button/button";
import {userApi} from "../../../api/common/user-api";

moment.locale("vi")


class FRNotification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: "PENDING",
            loadingA: false,
            loadingC: false
        }
    }

    cancelRequest = () => {
        this.setState({loadingC: true})
        userApi.cancelFriendRequest(this.props.data.person._id, userInfo.getState()._id)
            .then(() => this.setState({status: "CANCEL"}))
    }

    acceptRequest = () => {
        this.setState({loadingA: true})
        userApi.acceptFriendRequest(this.props.data.person._id, userInfo.getState()._id)
            .then(() => this.setState({status: "ACCEPT"}))
    }

    render() {
        let {data} = this.props;
        let {status, loadingA, loadingC} = this.state;
        return (
            <div className="fr-notification">

                {status === "PENDING" ? (
                    <>
                        <div><span className="high-light dark">{data.person.basic_info.username}</span> đã gửi cho bạn lời mời kết bạn</div>
                        <div className="fr-actions">
                            <Button className="btn btn-cancel mr-2" loading={loadingC}
                                    onClick={this.cancelRequest}>Hủy</Button>
                            <Button className="btn btn-common-primary" loading={loadingA} onClick={this.acceptRequest}>Chấp nhận</Button>
                        </div>
                    </>
                ) : (
                    <div className="result">
                        {status === "ACCEPT" ? (
                            <span>Bạn và <span className="high-light dark">{data.person.basic_info.username}</span> đã trở thành bạn bè.</span>) : `Hủy lời mời kết bạn thành công`}
                    </div>
                )}
            </div>
        );
    }
}


export class PostNotification extends Component {


    getRenderData = (data) => {
        let {notification_type} = data;
        let userID = userInfo.getState()._id;
        const dataMatcher = {
            "post_on_wall": {
                getAvatarUser: () => data.post.belonged_person,
                getReaction: () => null,
                getContent: () => (
                    <span>
                        <span className="high-light dark">{data.post.belonged_person.basic_info.username}</span> đã đăng lên dòng thời gian của bạn
                    </span>
                ),
                getTime: () => data.published_time,
                toLink: () => `/post/${data.post._id}`

            },
            "accept_friend_request": {
                getAvatarUser: () => data.person,
                getReaction: () => null,
                getContent: () => (
                    <span>
                        <span className="high-light dark">{data.person.basic_info.username}</span> đã chấp nhận lời mời kết bạn
                    </span>
                ),
                getTime: () => data.published_time,
                toLink: () => `/user/${person.basic_info.profile_link || data.person._id}`

            },
            "friend_request": {
                getAvatarUser: () => data.person,
                getReaction: () => null,
                getContent: () => (
                    <FRNotification
                        data={data}
                    />
                ),
                getTime: () => data.published_time,

            },
            "comment_on_followed_post": {
                getAvatarUser: () => data.comment.from_person,
                getReaction: () => null,
                getContent: () => (
                    <span>
                        <span className="high-light dark">{data.comment.from_person.basic_info.username}</span> đã bình luận về <span
                        className="high-light dark">bài viết</span> {data.post.belonged_person._id === userID ? "của bạn" : "mà bạn đang theo dõi"}: <span
                        className="content">{getRenderableContentFromMessage(data.comment, {disabledLink: true})}</span>
                    </span>
                ),
                getTime: () => data.comment.created_at,
                toLink: () => `/post/${data.post._id}?commentID=${data.comment._id}`
            },
            "mentioned_in_comment": {
                getAvatarUser: () => data.comment.from_person,
                getReaction: () => null,
                getContent: () => (
                    <span>
                        <span className="high-light dark">{data.comment.from_person.basic_info.username}</span> đã nhắc tới bạn trong một <span
                        className="high-light dark">bình luận</span>: <span
                        className="content">{getRenderableContentFromMessage(data.comment, {disabledLink: true})}</span>
                    </span>
                ),
                getTime: () => data.comment.created_at,
                toLink: () => `/post/${data.post._id}?commentID=${data.comment._id}`
            },
            "mentioned_in_reply": {
                getAvatarUser: () => data.reply.from_person,
                getReaction: () => null,
                getContent: () => (
                    <span>
                        <span className="high-light dark">{data.reply.from_person.basic_info.username}</span> đã nhắc đến
                        <span className="high-light dark"> bạn </span>trong một câu trả lời:
                        <span
                            className="content"> {getRenderableContentFromMessage(data.reply, {disabledLink: true})}</span>
                    </span>
                ),
                getTime: () => data.reply.created_at,
                toLink: () => `/post/${data.post._id}?commentID=${data.comment._id}&replyID=${data.reply._id}`
            },
            "reply_on_comment": {
                getAvatarUser: () => data.reply.from_person,
                getReaction: () => null,
                getContent: () => (
                    <span>
                        <span
                            className="high-light dark">{data.reply.from_person.basic_info.username}</span> đã trả lời <span
                        className="high-light dark">bình luận</span> của
                        <span
                            className="high-light dark"> {data.comment.from_person._id === userID ? "bạn" : data.comment.from_person._id === data.comment.from_person._id ? genderMatcher[data.comment.from_person.basic_info.gender] : data.comment.from_person.basic_info.username}</span>:
                        <span
                            className="content"> {getRenderableContentFromMessage(data.reply, {disabledLink: true})}</span>
                    </span>
                ),
                getTime: () => data.reply.created_at,
                toLink: () => `/post/${data.post._id}?commentID=${data.comment._id}&replyID=${data.reply._id}`
            },
            "react_comment": {
                getAvatarUser: () => data.reacted_by,
                getReaction: () => REACTION_EMOJI_MAP[data.reaction],
                getContent: () => (
                    <span>
                        <span className="high-light dark">{data.reacted_by.basic_info.username}</span> đã bày tỏ cảm xúc tới <span
                        className="high-light dark">bình luận</span> của
                        <span className="high-light dark"> bạn</span>
                    </span>
                ),
                getTime: () => data.reply ? data.reply.updated_at : data.comment.updated_at,
                toLink: () => `/post/${data.post._id}?${data.reply ? `replyID=${data.reply._id}` : `commentID=${data.comment._id}`}`
            },
            "react_post": {
                getAvatarUser: () => data.reacted_by,
                getReaction: () => REACTION_EMOJI_MAP[data.reaction],
                getContent: () => (
                    <span>
                        <span className="high-light dark">{data.reacted_by.basic_info.username}</span> đã bày tỏ cảm xúc tới <span
                        className="high-light dark">bài đăng</span> của
                        <span className="high-light dark"> bạn</span>
                    </span>
                ),
                getTime: () => data.post.updated_at,
                toLink: () => `/post/${data.post._id}`
            },
            "tagged_on_post": {
                getAvatarUser: () => data.post.belonged_person,
                getReaction: () => null,
                getContent: () => (
                    <span>
                        <span className="high-light dark">{data.post.belonged_person.basic_info.username}</span> đã gắn thẻ bạn trong <span
                        className="high-light dark">bài đăng</span>:
                         <span
                             className="content"> {getRenderableContentFromMessage(data.post, {disabledLink: true})}</span>
                    </span>
                ),
                getTime: () => data.post.created_at,
                toLink: () => `/post/${data.post._id}`
            },
            "tagged_on_post_file": {
                getFilePreview: () => data.file.path,
                getAvatarUser: () => data.post.belonged_person,
                getReaction: () => null,
                getContent: () => (
                    <span>
                        <span className="high-light dark">{data.post.belonged_person.basic_info.username}</span> đã gắn thẻ bạn trong <span
                        className="high-light dark">một ảnh</span>:
                         <span className="content"> {data.file.caption}</span>
                    </span>
                ),
                getTime: () => data.post.created_at,
                toLink: () => `/post/${data.post._id}?fileID=${data.file.rootFileID}`
            },
        };
        return dataMatcher[notification_type]

    }

    render() {
        let {notification, highLight, isPopup = true} = this.props;
        let {getAvatarUser, getReaction, getContent, getTime, getFilePreview, toLink} = this.getRenderData(notification);
        let reaction = getReaction();
        return (
            <div className={classnames("post-notification", {active: highLight && !notification.is_seen})}
                 onClick={() => toLink && customHistory.push(toLink())}>
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
                <div className={classnames("content-wrapper", {shorten: !!getFilePreview})}>
                    {getContent()}
                    {!isPopup && (
                        <div className="from-now">
                            {moment(getTime()).fromNow()}
                        </div>
                    )}

                </div>
                {getFilePreview && (
                    <div className="pn-file-preview">
                        <img src={getFilePreview()}/>
                    </div>
                )}
            </div>
        );
    }
}

