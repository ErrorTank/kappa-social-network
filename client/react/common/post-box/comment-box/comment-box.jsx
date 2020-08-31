import React, {Component} from 'react';
import {CommentInput} from "./comment-input";
import {utilityApi} from "../../../../api/common/utilities-api";
import {transformEditorState} from "../../../../common/utils/editor-utils";
import {convertToRaw} from "draft-js";
import {postApi} from "../../../../api/common/post-api";
import {Comment} from "./comment/comment";
import {LoadingInline} from "../../loading-inline/loading-inline";
import classnames from "classnames";

export class CommentBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            fetching: true,

        }

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

    submitComment = ({editorState, files}) => {
        return Promise.all(files.map(each => this.uploadSingleFile(each)))
            .then(newFiles => {
                let submittedData = {
                    files: newFiles,
                    ...transformEditorState(convertToRaw(editorState.getCurrentContent()))
                };

                postApi.createComment(this.props.post._id, submittedData)
                    .then(data => {
                        this.setState({list: [data].concat(this.state.list)});
                        this.props.onAddComment();
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
        let {post, commentsTotal} = this.props;
        let left = commentsTotal - list.length;
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
                            comment={each}
                            post={post}
                            key={each._id}
                            onChangeComment={comment => this.changeComment(comment, i)}
                            onDeleteComment={() => this.deleteComment(each)}
                            onDeleteReply={(reply) => this.deleteReply(each, reply, i)}
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

