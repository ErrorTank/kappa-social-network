import React, {Component} from 'react';
import {CommonInput} from "../../common-input/common-input";
import {CommentInput} from "./comment-input";

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
                    <CommentInput
                        onSubmit={this.props.onSubmit}
                    />
                )}
            </div>
        );
    }
}

