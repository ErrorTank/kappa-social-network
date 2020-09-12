import React, {Component} from 'react';
import {PostBox} from "../../../common/post-box/post-box";
import {userInfo} from "../../../../common/states/common";
import classnames from "classnames";
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';
import {LoadingInline} from "../../../common/loading-inline/loading-inline";

import {topFloatNotifications} from "../../../common/float-top-notification/float-top-notification";
import {customHistory} from "../../routes";

export class PostContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            post: null,
            loading: true
        }
        props.api(props.postID)
            .then((post) => this.setState({loading: false, post}))
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.post?._id !== this.props.post?._id){
            this.props.api(this.props.post._id)
                .then((post) => this.setState({loading: false, post}))

        }

    }

    render() {
        let {loading, post, } = this.state;
        let {params} = this.props;
        let user = userInfo.getState()._id;
        return (
            <div className="post-container feed-widget">
                {loading ? (
                   <LoadingInline/>
                ) : (
                    <PostBox
                        post={post}
                        isMyPost={user._id === post.belonged_person._id}
                        initBehaviorConfig={
                            params
                        }
                        onChangePost={(post) => {
                            topFloatNotifications.actions.push({
                                content: (
                                    <p className="common-noti-layout success">
                                        <i className="fal fa-check"></i>
                                        <span>Cập nhật bài đăng thành công!</span>
                                    </p>
                                )
                            });
                            this.setState({post});
                        }}
                        onDeletePost={() => {
                            topFloatNotifications.actions.push({
                                content: (
                                    <p className="common-noti-layout success">
                                        <i className="fal fa-check"></i>
                                        <span>Xóa bài đăng thành công!</span>
                                    </p>
                                )
                            });
                            customHistory.push(`/`);
                        }}
                        onSharePost={p => {
                            topFloatNotifications.actions.push({
                                content: (
                                    <p className="common-noti-layout success">
                                        <i className="fal fa-check"></i>
                                        <span>Chia sẻ bài đăng thành công!</span>
                                    </p>
                                )
                            });
                        }}

                    />
                )}

            </div>
        );
    }
}

