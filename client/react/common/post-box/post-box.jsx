import React, {Component, Fragment} from 'react';
import {Dropdownable} from "../dropdownable/dropdownable";
import {Avatar} from "../avatar/avatar";
import isNil from "lodash/isNil"
import moment from "moment";
import {PostPolicies, PostPoliciesMAP} from "../create-post-modal/create-post-modal";
import {getRenderableContentFromMessage} from "../../../common/utils/editor-utils";
import {PbFilesPreview} from "./files-preview";
import {HyperLink} from "../../layout/authen-layout/create-message-widget/chat-box/message-section/hyper-link";
import {HyperlinkWrapper} from "../../layout/authen-layout/create-message-widget/chat-box/message-section/message";
moment.locale("vi");

export class PostBox extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
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
                label: () => "Chỉnh sửa bìa viết",
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

                </div>
            </div>
        );
    }
}

