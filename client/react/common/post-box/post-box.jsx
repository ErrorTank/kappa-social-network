import React, {PureComponent, Fragment} from 'react';
import {Dropdownable} from "../dropdownable/dropdownable";
import {Avatar} from "../avatar/avatar";
import isNil from "lodash/isNil"
import moment from "moment";
import {PostPolicies, PostPoliciesMAP} from "../create-post-modal/create-post-modal";
import {getRenderableContentFromMessage} from "../../../common/utils/editor-utils";
import {PbFilesPreview} from "./files-preview";
import {HyperLink} from "../../layout/authen-layout/create-message-widget/chat-box/message-section/hyper-link";
import {HyperlinkWrapper} from "../../layout/authen-layout/create-message-widget/chat-box/message-section/message";
import {sortReactions} from "../../../common/utils/post-utils";
import {Emoji} from "emoji-mart";
import {REACTION_EMOJI_MAP, REACTIONS, ReactionsWidget} from "../reactions-widget/reactions-widget";
import {userInfo} from "../../../common/states/common";
import classnames from "classnames"
import {postApi} from "../../../api/common/post-api";
import {getActiveReaction} from "../../../common/utils/messenger-utils";
import {Tooltip} from "../tooltip/tooltip";
import {ReactionTooltip} from "./reaction-tooltip";
import {CommentBox} from "./comment-box/comment-box";
moment.locale("vi");

export class PostBox extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            commentsTotal: 0,
        }
    }

    react = (config) => {
        let {post, onChangePost} = this.props;
        postApi.updatePostReaction(post._id, config, userInfo.getState()._id)
            .then(newPost => onChangePost(newPost))
    }

    render() {
        let {commentsTotal} = this.state;
        let {post, isMyPost, onChangePost} = this.props;
        let postActions = [
            {
                icon: <i className="fal fa-bookmark"></i>,
                label: () => "Lưu bài viết",
            }, {
                icon: (<><i className="fal fa-bookmark"></i><i className="fal fa-slash"></i></>),
                label: () => "Bỏ lưu bài viết",
            }, {
                icon: <i className="fal fa-pen"></i>,
                label: () => "Chỉnh sửa bài viết",
                condition: () => isMyPost

            }, {
                icon: <i className="fal fa-trash-alt"></i>,
                label: () => "Xóa bài viết",
                condition: () => isMyPost
            }, {
                icon: <i className="fal fa-map-marker-times"></i>,
                label: (item) => `Chặn bài viết từ ${item.basic_info.name}`,
                condition: (item) => item.belonged_group || item.belonged_page
            }, {
                icon: <i className="fal fa-bell"></i>,
                label: () => `Bật thông báo cho bài viết`,
            }, {
                icon: (<><i className="fal fa-bell"></i><i className="fal fa-slash"></i></>),
                label: () => `Ẩn thông báo từ bài viết`,
            }, {
                icon: <i className="fal fa-times-square"></i>,
                label: () => "Ẩn bài viết",

            },
        ]
        let reactions = sortReactions(post.reactions);
        let user = userInfo.getState();
        let activeReaction = getActiveReaction(user._id, post.reactions);
        let reactionsLength = reactions.countReactions();
        // let activeReaction = reactions.reduce((total, cur) => [...total, ...Object.values(cur)[0].map(each => ({key: Object.keys(cur)[0], value: each}))],[]).find(each => each.value === user._id);
        return (
            <div className="post-box white-box">
                <div className="post-header">
                    <div className="avatar-wrapper">
                        <Avatar
                            user={post.belonged_person}
                        />
                    </div>
                    <div className="post-meta-data">
                        <div className="upper">
                            {post.belonged_person && (
                                <>
                                    <a className="link">{post.belonged_person.basic_info.username}</a>
                                    {!post.belonged_group && !!post.tagged.length && (
                                        <span> đang ở cùng với {post.tagged.map((each, i) => <Fragment key={each._id}><a className="link">{each.basic_info.username}</a>{i === post.tagged.length - 2 && " và "}{i < post.tagged.length - 2 && ", "}</Fragment>)}</span>
                                    )}
                                </>
                            )}
                        </div>
                        <div className="timer">
                            <span className="policy">{PostPolicies.find(each => each.value === post.policy).icon}</span> - <span className="last-active">{moment(post.created_at).fromNow()}</span>
                        </div>
                    </div>
                    <Dropdownable
                        className={"post-actions"}
                        toggle={() => (
                            <div className="post-actions-toggle">
                                <i className="fal fa-ellipsis-h"></i>
                            </div>
                        )}
                        content={() => (
                            <div className={"post-actions-dropdown"}>
                                {postActions.map((each, i) => (isNil(each.condition) ? true : each.condition?.(each)) ? (
                                    <div className="setting-row" key={i}>
                                        <div className="icon-wrapper">
                                            {each.icon}
                                        </div>
                                        <div className="label">{each.label(each)}</div>
                                    </div>
                                ) : null)}
                            </div>

                        )}
                    />

                </div>

                <div className="post-body">
                    {post.content && (
                        <div className="content">
                            {getRenderableContentFromMessage(post)}
                        </div>
                    )}
                    {!!post.files.length && (
                        <PbFilesPreview
                            post={post}
                            onChangePost={onChangePost}
                        />
                    )}
                    {!!post.hyperlinks.length && (
                        <HyperlinkWrapper links={post.hyperlinks}>
                            <HyperLink
                                link={post.hyperlinks[0]}

                            />
                        </HyperlinkWrapper>


                    )}
                </div>
                <div className="post-footer">
                    {(reactions.toEmojiMap().length > 0 || commentsTotal > 0 || post.share_count > 0) && (
                        <div className="statistic">
                            <div className="reactions">
                                {reactions.toEmojiMap().map(each => (
                                    <Tooltip
                                        // delay={500}
                                        key={each.key}
                                        className={"reaction-detail"}
                                        text={() => (
                                            <ReactionTooltip
                                                type={each.reverse_key}
                                                api={() => postApi.getPostReactionList(post._id, each.reverse_key, 0, 10)}
                                            />
                                        )}
                                    >
                                     <span className="reaction"> <Emoji
                                         set={'facebook'}
                                         emoji={each.icon_config}
                                         size={20}
                                     /></span>
                                    </Tooltip>

                                ))}
                                {reactionsLength > 1 && <span className="reaction-count"> {activeReaction &&  (
                                    <span>Bạn và </span>
                                )}
                                    {activeReaction ? reactionsLength - 1 : reactionsLength}
                                    {activeReaction && (
                                        <span> người khác</span>
                                    )}</span>}

                            </div>
                            <div className="count">
                                {commentsTotal > 0 && (
                                    <div className="count-box">
                                        {commentsTotal} bình luận
                                    </div>
                                )}
                                {post.share_count > 0 && (
                                    <div className="count-box">
                                        {post.share_count} lượt chia sẻ
                                    </div>
                                )}
                            </div>

                        </div>
                    )}

                    <div className="post-user-actions">
                        <div className={classnames("action react", {active: activeReaction})} onClick={() => this.react(activeReaction ? {off: activeReaction} : {on: REACTIONS.thump_up})}>
                            <div className="post-reactions">
                                <ReactionsWidget
                                    onSelect={this.react}
                                    active={activeReaction}
                                />
                            </div>
                            <i className="fal fa-thumbs-up"></i>
                            <span>Thích</span>
                        </div>
                        {!post.comment_disabled && (
                            <div className="action">
                                <i className="fal fa-comment"></i>
                                <span>Bình luận</span>
                            </div>
                        )}
                        {!post.block_share && (
                            <div className="action">
                                <i className="fal fa-share"></i>
                                <span>Chia sẻ</span>
                            </div>
                        )}

                    </div>

                    <CommentBox
                        api={({skip, limit}) => postApi.getCommentsForPost(post._id, skip, limit).then(data => {
                            this.setState({commentsTotal: data.total})
                            return data;
                        })}
                        post={post}
                        onAddComment={() => this.setState({commentsTotal: commentsTotal + 1})}
                        commentsTotal={commentsTotal}
                    />
                </div>
            </div>
        );
    }
}

