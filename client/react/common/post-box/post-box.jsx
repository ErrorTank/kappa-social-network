import React, {Component} from 'react';
import {Dropdownable} from "../dropdownable/dropdownable";
import {Avatar} from "../avatar/avatar";

export class PostBox extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        let {post, isMyPost} = this.props;
        let postActions = [
            {
                icon: <i className="fal fa-bookmark"></i>,
                label: () => "Lưu bài viết",
            },{
                icon: (<><i className="fal fa-bookmark"></i><i className="fal fa-slash"></i></>),
                label: () => "Bỏ lưu bài viết",
            },{
                icon: <i className="fal fa-pen"></i>,
                label: () => "Chỉnh sửa bìa viết",
                condition: isMyPost

            }, {
                icon: <i className="fal fa-trash-alt"></i>,
                label: () => "Xóa bài viết",
                condition: isMyPost
            }, {
                icon: <i className="fal fa-map-marker-times"></i>,
                label: (item) => `Chặn bài viết từ ${item.basic_info.name}`,
            },{
                icon: <i className="fal fa-bell"></i>,
                label: () => `Bật thông báo cho bài viết`,
            },{
                icon: (<><i className="fal fa-bell"></i><i className="fal fa-slash"></i></>),
                label: () => `Ẩn thông báo từ bài viết`,
            }, {
                icon: <i className="fal fa-times-square"></i>,
                label: () => "Ẩn bài viết",

            },
        ]
        return (
            <div className="post-box white-box">
                <div className="post-header">
                    <div className="avatar-wrapper">
                        <Avatar
                            user={post.belonged_person}
                        />
                    </div>
                    <div className="post-meta-data">

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
                                {postActions.map((each, i) => (
                                    <div className="setting-row" key={i}>
                                        {each.icon}
                                        <p>{each.label}</p>
                                    </div>
                                ))}
                            </div>

                        )}
                    />

                </div>
                <div className="post-body">

                </div>
                <div className="post-footer">

                </div>
            </div>
        );
    }
}

