import React, {Component} from 'react';
import moment from "moment";
import {Avatar} from "../../../avatar/avatar";
import classnames from "classnames"
import {getRenderableContentFromMessage} from "../../../../../common/utils/editor-utils";
import {SmartImgWrapper} from "../../../smart-img-wrapper/smart-img-wrapper";
import isNil from "lodash/isNil";
import {Dropdownable} from "../../../dropdownable/dropdownable";
import {REACTIONS, ReactionsWidget} from "../../../reactions-widget/reactions-widget";
import {sortReactions} from "../../../../../common/utils/post-utils";
import {userInfo} from "../../../../../common/states/common";
import {getActiveReaction} from "../../../../../common/utils/messenger-utils";
import {postApi} from "../../../../../api/common/post-api";
import {ReactionDisplay} from "../../../../layout/authen-layout/create-message-widget/chat-box/message-section/reaction-display/reaction-display";

export class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    react = (config) => {
        let {comment, onChangeComment, post} = this.props;
        postApi.updateCommentReaction(post._id, comment._id, config, userInfo.getState()._id)
            .then(newComment => onChangeComment(newComment))
    }

    render() {
        let {comment} = this.props;
        let user = userInfo.getState();
        let activeReaction = getActiveReaction(user._id, comment.reactions);
        console.log(activeReaction)
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
                                    <div className="dropdown-item">
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
                    <div className={classnames("action react", {active: activeReaction})} onClick={() => this.react(activeReaction ? {off: activeReaction} : {on: REACTIONS.thump_up})}>
                        <div className="post-reactions">
                            <ReactionsWidget
                                onSelect={this.react}
                                active={activeReaction}
                            />
                        </div>
                        <span>Thích</span>
                    </div>
                    <span style={{margin: "0 3px"}}>-</span>
                    <div className="action">
                        <span>Trả lời</span>
                    </div>
                    <span style={{margin: "0 3px"}}>-</span>
                    <span className="created_at">{moment(comment.created_at).fromNow()}</span>
                </div>
            </div>
        );
    }
}

