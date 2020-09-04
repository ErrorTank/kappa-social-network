import React, {PureComponent, Fragment} from 'react';
import {Dropdownable} from "../dropdownable/dropdownable";
import {Avatar} from "../avatar/avatar";
import isNil from "lodash/isNil"

import {createPostModal, PostPolicies, PostPoliciesMAP} from "../create-post-modal/create-post-modal";
import {getRenderableContentFromMessage} from "../../../common/utils/editor-utils";
import {PbFilesPreview} from "./files-preview";
import {HyperLink} from "../../layout/authen-layout/create-message-widget/chat-box/message-section/hyper-link";
import {HyperlinkWrapper} from "../../layout/authen-layout/create-message-widget/chat-box/message-section/message";
import {sortReactions} from "../../../common/utils/post-utils";
import {Emoji} from "emoji-mart";
import {REACTION_EMOJI_MAP, REACTIONS, ReactionsWidget} from "../reactions-widget/reactions-widget";
import {userBlockedPosts, userFollowedPosts, userInfo, userSavedPosts} from "../../../common/states/common";
import classnames from "classnames"
import {postApi} from "../../../api/common/post-api";
import {getActiveReaction} from "../../../common/utils/messenger-utils";
import {Tooltip} from "../tooltip/tooltip";
import {ReactionTooltip} from "./reaction-tooltip";
import {CommentBox} from "./comment-box/comment-box";
import createMentionEntities from "../../../common/utils/mention-utils";
import { EditorState,} from 'draft-js';
import {PostActions} from "./post-actions";
import {SharePostDisplay} from "../share-post-display/share-post-display";
import ReactDOM from "react-dom";
import {LastActive, } from "../use-last-active";
import {feedPostIO, } from "../../../socket/sockets";




export class PostBox extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            commentsTotal: 0,
        }
        this.isJoinRoom = false;
        if(!props.isPreview){
            this.io = feedPostIO.getIOInstance();
            this.io.on("edit-post", newPost => {

                if(newPost._id === props.post._id){

                    props.onChangePost(newPost)
                }

            })

        }
    }

    react = (config) => {
        let {post, onChangePost} = this.props;
        postApi.updatePostReaction(post._id, config, userInfo.getState()._id)
            .then(newPost => onChangePost(newPost))
    }

    sharePost = () => {
        let {post} = this.props;
        createPostModal.open({
            isShare: true,
            postID: post.shared_post || post._id
        }).then((p) => {
            if(p){
                this.props.onSharePost(p)
            }
        });
    }

    deletePost = () => {
        let {post, onDeletePost} = this.props;
        postApi.deletePost(post._id)
            .then(() => {
                userFollowedPosts.setState(userFollowedPosts.getState().filter(each => each !== post._id))
                return onDeletePost()
            })
    }

    editPost = () => {
        let {post, onChangePost} = this.props;
        // console.log(post.mentions)

        createPostModal.open({
            isEdit: true,
            data: {
                _id: post._id,
                editorState: EditorState.createWithContent(createMentionEntities(post.content, post.mentions)),
                files: post.files,
                tagged: post.tagged,
                policy: PostPolicies.find(each => each.value === post.policy),
                comment_disabled: post.comment_disabled,
                block_share: post.block_share
            }
        }).then(p => {
            if(p){
                onChangePost(p)
            }
        })
    }

    toggleFollow = () => {
        let {post} = this.props;
        postApi.toggleFollowPost(post._id)
            .then(({followed_posts}) => {
                userFollowedPosts.setState(followed_posts);
            })
    }

    toggleSave = () => {
        let {post} = this.props;
        postApi.toggleSavedPost(post._id)
            .then(({saved_posts}) => {
                userSavedPosts.setState(saved_posts);
            })
    }

    toggleBlock = () => {
        let {post, onDeletePost} = this.props;
        postApi.toggleBlockPost(post._id)
            .then(({blocked_posts}) => {
                userBlockedPosts.setState(blocked_posts);
                onDeletePost();
            })
    }

    handleObserver = (entries) => {
        let elem = entries[0];

        let {post, isMyPost} = this.props;
        if(elem.intersectionRatio >= 0.1 && !this.isJoinRoom){
            console.log("clgt")

            this.isJoinRoom = true;
            this.io.emit("join-post-room", {
                userID: userInfo.getState()._id,
                postID: post._id,
            });


        }



    }

    componentDidMount() {
        let {isPreview} = this.props
        if(!isPreview){
            let root = document.getElementsByClassName("feed-infinite")[0];
            this.observer = new IntersectionObserver(this.handleObserver, {
                root,
                threshold: 0.1,
                rootMargin: "0px"
            });
            this.observer.observe(ReactDOM.findDOMNode(this))

        }


    }

    unsubscribeIO = () => {
        if(this.io){
            this.io.emit("leave-post-room", {
                userID: userInfo.getState()._id,
                postID: this.props.post._id,
            });
            this.io.off("edit-post");
        }
    }

    componentWillUnmount() {
        if(this.observer){
            this.observer.disconnect();
        }
        this.unsubscribeIO();
    }


    render() {
        let {commentsTotal} = this.state;
        let {post, isMyPost, onChangePost, isPreview} = this.props;



        let reactions = sortReactions(post.reactions);
        let user = userInfo.getState();
        let activeReaction = getActiveReaction(user._id, post.reactions);
        let reactionsLength = reactions.countReactions();
        // console.log(getRenderableContentFromMessage(post))
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
                            <span className="policy">{PostPolicies.find(each => each.value === post.policy).icon}</span> - <span className="last-active"><LastActive lastActive={post.created_at}/></span>
                        </div>
                    </div>
                    {!isPreview && (
                        <Dropdownable
                            className={"post-actions"}
                            toggle={() => (
                                <div className="post-actions-toggle">
                                    <i className="fal fa-ellipsis-h"></i>
                                </div>
                            )}
                            content={(dropdownActions) => (
                                <PostActions
                                    isMyPost={isMyPost}
                                    post={post}
                                    editPost={this.editPost}
                                    deletePost={this.deletePost}
                                    toggleFollow={this.toggleFollow}
                                    toggleSave={this.toggleSave}
                                    toggleBlock={this.toggleBlock}

                                    {...dropdownActions}
                                />

                            )}
                        />

                    )}

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
                            isPreview={isPreview}
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
                    {!isPreview && post.shared_post && (
                        <div className="post-share">
                            <SharePostDisplay
                                postID={post.shared_post}
                            />
                        </div>

                    )}
                </div>

                {!isPreview && (
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
                                <div className="action" onClick={() => this.mainInput.focus()}>
                                    <i className="fal fa-comment"></i>
                                    <span>Bình luận</span>
                                </div>
                            )}
                            {!post.block_share && (
                                <div className="action" onClick={this.sharePost}>
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
                            inputRef={mainInput => this.mainInput = mainInput}
                            onDeleteComment={() => this.setState({commentsTotal: commentsTotal - 1})}
                        />
                    </div>
                )}
            </div>
        );
    }
}

