import React, {Component} from 'react';
import moment from "moment";
import {Avatar} from "../../../avatar/avatar";
import classnames from "classnames"
import {getRenderableContentFromMessage} from "../../../../../common/utils/editor-utils";
import {SmartImgWrapper} from "../../../smart-img-wrapper/smart-img-wrapper";
import isNil from "lodash/isNil";
import {Dropdownable} from "../../../dropdownable/dropdownable";

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


                </div>
                {comment.files.length > 0 && (
                    <div className="comment-media-info">
                        <SmartImgWrapper
                            className={"comment-media-wrapper"}
                            imgSrc={comment.files[0].path}
                            maxWidth={300}
                            maxHeight={300}
                        />
                    </div>
                )}

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

