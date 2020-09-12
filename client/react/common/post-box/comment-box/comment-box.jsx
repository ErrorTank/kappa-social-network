import React, {Component} from 'react';
import {CommentInput} from "./comment-input";
import {utilityApi} from "../../../../api/common/utilities-api";
import {transformEditorState} from "../../../../common/utils/editor-utils";
import {convertToRaw} from "draft-js";
import {postApi} from "../../../../api/common/post-api";
import {Comment} from "./comment/comment";
import {LoadingInline} from "../../loading-inline/loading-inline";
import classnames from "classnames";
import {userFollowedPosts, userInfo} from "../../../../common/states/common";
import {feedPostIO} from "../../../../socket/sockets";

export class CommentBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            fetching: true,

        }
        this.io = feedPostIO.getIOInstance();
        this.io.on("new-comment", ({postID, comment}) => {

            if(postID === props.post._id){
                this.addNewComment(comment)
            }

        })
        this.io.on("delete-comment", ({postID, comment}) => {

            if(postID === props.post._id){

               this.deleteComment(comment)
            }

        })
        this.io.on("edit-comment", ({postID, comment}) => {
            if(postID === props.post._id){
                let i = this.state.list.findIndex(each => each._id === comment._id)
                if(i > -1){
                    this.changeComment(comment, i)
                }

            }

        })
    }

    reFetch = () => {
        this.setState({list: []}, () => {
            this.fetchComments({
                skip: 0,
                limit: 2
            });
        })


    }

    unsubscribeIO = () => {
        if(this.io){
            this.io
                .off("new-comment")
                .off("delete-comment")
                .off("edit-comment");
        }
    }

    componentWillUnmount() {

        this.unsubscribeIO();
    }

    componentDidMount() {
        this.fetchComments({
            skip: 0,
            limit: 2
        });
    }

    uploadSingleFile = (file) => {
        return postApi.preUploadMedia({file: file.file}, "file")
            .then(fileData => ({
                ...fileData
            }))
    }

    addNewComment = cmt => {
        this.setState({list: [cmt].concat(this.state.list)});
        this.props.onAddComment();
    }

    submitComment = ({editorState, files}) => {
        return Promise.all(files.map(each => this.uploadSingleFile(each)))
            .then(newFiles => {
                let submittedData = {
                    files: newFiles,
                    ...transformEditorState(convertToRaw(editorState.getCurrentContent()))
                };

                postApi.createComment(this.props.post._id, submittedData)
                    .then(data => {
                        let followedPosts = userFollowedPosts.getState();
                        if(!followedPosts.find(each => each === this.props.post._id)){
                            userFollowedPosts.setState(followedPosts.concat(this.props.post._id))
                        }
                        this.addNewComment(data)

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

    deleteReply = (comment, reply, i) => {
        let {list} = this.state;
        let newComment = {...comment, replies: comment.replies.filter(each => each !== reply._id)};
        let newList = [...list];
        newList.splice(i, 1, newComment);
        this.setState({list: newList});

    }

    fetchComments = (config) => {
        this.setState({fetching: true})
        return this.props.api(config).then(({list}) => {
            this.setState({list: this.state.list.concat(list), fetching: false})
        })
    }

    deleteComment = (cmt) => {
        this.setState({list: this.state.list.filter(each => each._id !== cmt._id)})
        this.props.onDeleteComment();
    }

    loadMore = () => {

        this.fetchComments({
            skip: this.state.list.length,
            limit: 5
        })
    }

    changeComment = (comment, i) => {

        let {list} = this.state;
        let newList = [...list];
        newList.splice(i, 1, comment);
        this.setState({list: newList})
    }

    render() {
        let {list} = this.state;
        let {post, commentsTotal, initBehaviorConfig = {}} = this.props;
        let left = commentsTotal - list.length;
        let {commentID, replyID} = initBehaviorConfig;
        return (
            <div className="comment-box">
                <div className="comments">
                    {left > 0 && (
                        <div className="load-more" onClick={this.loadMore}>
                            Xem thêm {left > 5 ? 5 : left} bình luận
                            {this.state.fetching && (
                                <i className={classnames("far fa-spinner-third spin-icon spin load-icon")}/>
                            )}
                        </div>
                    )}
                    {[...list].reverse().map((each, i) => (
                        <Comment
                            getRepliesApi={config => postApi.getReplyForComment(each._id, config, {focusReply: replyID})}
                            comment={each}
                            needPreFetch={each._id === initBehaviorConfig.commentID && initBehaviorConfig.replyID}
                            post={post}
                            key={each._id}
                            onChangeComment={comment => this.changeComment(comment, this.state.list.findIndex(c => c._id === comment._id))}
                            onDeleteComment={() => this.deleteComment(each)}
                            onDeleteReply={(reply) => this.deleteReply(each, reply, this.state.list.findIndex(c => c._id === each._id))}
                        />
                    ))}
                </div>
                {post.comment_disabled ? (
                    <div className="disabled-notify">
                        Tính năng bình luận đã bị tắt
                    </div>
                ) : (
                    <div className={"comment-box-input"}>
                        <CommentInput
                            onSubmit={this.submitComment}
                            api={this.getMentionApi()}
                            ref={mainInput => this.props.inputRef(mainInput)}
                        />
                    </div>

                )}
            </div>
        );
    }
}

