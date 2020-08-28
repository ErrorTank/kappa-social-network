import React, {Component} from 'react';
import moment from "moment";
import {Avatar} from "../../../avatar/avatar";
import classnames from "classnames"
import {getRenderableContentFromMessage} from "../../../../../common/utils/editor-utils";

export class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        let {comment} = this.props;
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
                    </div>
                </div>
                <div className="comment-media-info">

                </div>
                <div className="comment-actions">
                    <span className="action">Thích</span>
                    <span style={{margin: "0 3px"}}>-</span>
                    <span className="action">Trả lời</span>
                    <span style={{margin: "0 3px"}}>-</span>
                    <span className="created_at">{moment(comment.created_at).fromNow()}</span>
                </div>
            </div>
        );
    }
}

