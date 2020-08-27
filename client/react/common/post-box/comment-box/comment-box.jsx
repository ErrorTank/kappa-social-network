import React, {Component} from 'react';
import {CommentInput} from "./comment-input";
import {utilityApi} from "../../../../api/common/utilities-api";

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
        let {post} = this.props;
        return (
            <div className="comment-box">
                <div className="comments">

                </div>
                {post.comment_disabled ? (
                    <div className="disabled-notify">
                        Tính năng bình luận đã bị tắt
                    </div>
                ) : (
                    <div className={"comment-box-input"}>
                        <CommentInput
                            onSubmit={this.props.onSubmit}
                            api={this.getMentionApi()}
                        />
                    </div>

                )}
            </div>
        );
    }
}

