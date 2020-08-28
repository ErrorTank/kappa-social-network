import React, {Component} from 'react';
import {CommentInput} from "./comment-input";
import {utilityApi} from "../../../../api/common/utilities-api";
import {transformEditorState} from "../../../../common/utils/editor-utils";
import {convertToRaw} from "draft-js";
import {postApi} from "../../../../api/common/post-api";
import {Comment} from "./comment/comment";

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
        if(post.belonged_group){
            return ({keyword}) => utilityApi.getGroupMentions(post.belonged_group._id, keyword)
        }
        if(post.belonged_page){
            return ({keyword}) => utilityApi.getPageMentions(post.belonged_page._id, keyword)
        }
        return ({keyword}) => utilityApi.searchFriends(keyword)
    }

    fetchComments = (config) => {
        this.setState({fetching: true})
        return this.props.api(config).then(({list}) => {
            this.setState({list, fetching: false})
        })
    }

    render() {
        let {list} = this.state;
        let {post} = this.props;
        return (
            <div className="comment-box">
                <div className="comments">
                    {list.map(each => (
                        <Comment
                            comment={each}
                            key={each._id}
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
                        />
                    </div>

                )}
            </div>
        );
    }
}

