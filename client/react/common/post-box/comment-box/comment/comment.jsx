import React, {Component} from 'react';
import moment from "moment";
import {Avatar} from "../../../avatar/avatar";
import classnames from "classnames"
import {getRenderableContentFromMessage, transformEditorState} from "../../../../../common/utils/editor-utils";
import {SmartImgWrapper} from "../../../smart-img-wrapper/smart-img-wrapper";
import isNil from "lodash/isNil";
import {Dropdownable} from "../../../dropdownable/dropdownable";
import {REACTIONS, ReactionsWidget} from "../../../reactions-widget/reactions-widget";
import {sortReactions} from "../../../../../common/utils/post-utils";
import {userInfo} from "../../../../../common/states/common";
import {getActiveReaction} from "../../../../../common/utils/messenger-utils";
import {postApi} from "../../../../../api/common/post-api";
import {ReactionDisplay} from "../../../../layout/authen-layout/create-message-widget/chat-box/message-section/reaction-display/reaction-display";
import {CommentInput} from "../comment-input";
import {convertToRaw} from "draft-js";
import {utilityApi} from "../../../../../api/common/utilities-api";

export class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            replies: [],
            loadReplies: false,
            showReplyInput: false
        }
    }
    uploadSingleFile = (file) => {
        return postApi.preUploadMedia({file: file.file}, "file")
            .then(fileData => ({
                ...fileData
            }))
    }

    react = (config) => {
        let {comment, onChangeComment, post} = this.props;
        postApi.updateCommentReaction(post._id, comment._id, config, userInfo.getState()._id)
            .then(newComment => onChangeComment(newComment))
    }

    submitReply = ({editorState, files}) => {
        let {comment} = this.props;
        return Promise.all(files.map(each => this.uploadSingleFile(each)))
            .then(newFiles => {
                let submittedData = {
                    files: newFiles,
                    ...transformEditorState(convertToRaw(editorState.getCurrentContent()))
                };

                postApi.createCommentReply(comment._id, submittedData)
                    .then(data => {

                        this.setState({replies: this.state.replies.concat(data)});
                        this.props.onChangeComment({
                            ...comment,
                            replies: comment.replies.concat(data._id)
                        });
                    })
            })
    }

    getMentionApi = () => {
        let {post} = this.props;
        if (post.belonged_group) {
            return ({keyword}) => utilityApi.getGroupMentions(post.belonged_group._id, keyword)
        }
        if (post.belonged_page) {
            return ({keyword}) => utilityApi.getPageMentions(post.belonged_page._id, keyword)
        }
        return ({keyword}) => utilityApi.searchFriends(keyword)
    }

    onReply = () => {
        let {isReply} = this.props;
        if (isReply) {

        } else {
            this.setState({showReplyInput: true})
        }
    }

    changeReply = (reply, i) => {
        let {replies} = this.state;
        let newList = [...replies];
        newList.splice(i, 1, reply);
        this.setState({replies: newList})
    }

    fetchReplies = (config) => {
        this.setState({loadReplies: true})
        return postApi.getReplyForComment(this.props.comment._id, config).then(({list}) => {
            this.setState({replies: list.concat(this.state.replies), loadReplies: false})
        })
    }

    deleteComment = () => {
        let {onDeleteComment, comment, isReply, onDeleteReply, post, father} = this.props;
        !isReply ?
            postApi.deleteComment(post._id, comment._id)
                .then(() => onDeleteComment()):
            postApi.deleteReply(father._id, comment._id)
                .then(() => {

                    onDeleteReply(comment);
                })
    }

    render() {
        let {replies, loadReplies, showReplyInput} = this.state;
        let {comment, onDeleteReply} = this.props;
        let user = userInfo.getState();
        let activeReaction = getActiveReaction(user._id, comment.reactions);
        // console.log(activeReaction)
        return (
            <div className={"comment"}>
                <div className="comment-main">
                    <div className="avatar-wrapper">
                        <Avatar
                            user={comment.from_person}
                        />
                    </div>
                    <div className={classnames("comment-content", {"no-content": !comment.content})}>
                        <div className="username">{comment.from_person.basic_info.username}</div>
                        {comment.content && (
                            <div className="content">{getRenderableContentFromMessage(comment)}</div>
                        )}
                        {!comment.files.length && (
                            <div className="comment-reaction">
                                <ReactionDisplay
                                    reactions={comment.reactions}
                                />
                            </div>
                        )}
                    </div>
                    {comment.from_person._id === user._id && (
                        <Dropdownable
                            className={"comment-config"}
                            toggle={() => (
                                <i className="fal fa-ellipsis-h"></i>
                            )}
                            position={"center"}
                            content={() => (
                                <div className={"comment-config-dropdown"}>
                                    <div className="dropdown-item">
                                        Chỉnh sửa
                                    </div>
                                    <div className="dropdown-item" onClick={this.deleteComment}>
                                        Xóa
                                    </div>
                                </div>

                            )}
                        />
                    )}


                </div>
                {comment.files.length > 0 && (
                    <div className="comment-media-info">
                        <SmartImgWrapper
                            className={"comment-media-wrapper"}
                            imgSrc={comment.files[0].path}
                            maxWidth={300}
                            maxHeight={300}
                        />
                        {comment.files.length > 0 && (
                            <div className="comment-reaction">
                                <ReactionDisplay
                                    reactions={comment.reactions}
                                />
                            </div>
                        )}
                    </div>
                )}

                <div className="comment-actions">
                    <div className={classnames("action react", {active: activeReaction})}
                         onClick={() => this.react(activeReaction ? {off: activeReaction} : {on: REACTIONS.thump_up})}>
                        <div className="post-reactions">
                            <ReactionsWidget
                                onSelect={this.react}
                                active={activeReaction}
                            />
                        </div>
                        <span>Thích</span>
                    </div>
                    <span style={{margin: "0 3px"}}>-</span>
                    <div className="action" onClick={this.onReply}>
                        <span>Trả lời</span>
                    </div>
                    <span style={{margin: "0 3px"}}>-</span>
                    <span className="created_at">{moment(comment.created_at).fromNow()}</span>
                </div>
                {!this.props.isReply && (
                    <div className="replies">
                        {comment.replies.length > 0 && (
                            <div className="more-replies"
                                 onClick={replies.length === comment.replies.length ? () => this.setState({replies: []}) : () => this.fetchReplies({
                                     skip: this.state.replies.length,
                                     limit: 5
                                 })}>
                                {replies.length === comment.replies.length ? (
                                    <>
                                        <i className="far fa-arrow-up"></i>
                                        <span style={{marginLeft: "5px"}}>Ẩn {replies.length} phản hồi</span>
                                    </>
                                ) : (
                                    <>

                                        <i className="fal fa-reply"></i>
                                        <span
                                            style={{marginLeft: "5px"}}>Xem {(comment.replies.length - replies.length) > 5 ? 5 : comment.replies.length - replies.length} phản hồi</span>
                                    </>
                                )}
                                {loadReplies && (
                                    <i className={classnames("far fa-spinner-third spin-icon spin load-icon")}/>
                                )}
                            </div>
                        )}
                        {replies.map((each, i) => (
                            <Comment
                                comment={each}
                                post={this.props.post}
                                isReply={true}
                                father={comment}
                                key={each._id}
                                onChangeComment={reply => this.changeReply(reply, i)}
                                onDeleteReply={() => {
                                    this.setState({replies: this.state.replies.filter(item => item._id !== each._id)})
                                    onDeleteReply(each)
                                }}
                            />
                        ))}
                        {showReplyInput && (
                            <CommentInput
                                onSubmit={this.submitReply}
                                api={this.getMentionApi()}
                                isReply={true}
                            />
                        )}
                    </div>
                )}

            </div>
        );
    }
}
