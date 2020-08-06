import React, {Component} from 'react';
import {userInfo} from "../../../../../common/states/common";
import {Avatar} from "../../../../common/avatar/avatar";
import {createPostModal} from "../../../../common/create-post-modal/create-post-modal";



export class PostCreationBox extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    openCreatePostModal = () => {
        createPostModal.open()
    };

    render() {
        let user = userInfo.getState();
        return (
            <div className="post-creation-box white-box">
                <div className="avatar-wrapper">
                    <Avatar
                        user={user}
                    />
                </div>
                <div className="placeholder" onClick={this.openCreatePostModal}>
                    Hôm nay bạn nghĩ gì, {user.basic_info.username}?
                </div>
            </div>
        )
    }
}




export class FeedWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <div className="feed-widget">
                <PostCreationBox/>

            </div>
        );
    }
}
