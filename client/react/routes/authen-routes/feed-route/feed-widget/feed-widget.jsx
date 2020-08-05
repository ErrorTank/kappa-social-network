import React, {Component} from 'react';
import {userInfo} from "../../../../../common/states/common";
import {Avatar} from "../../../../common/avatar/avatar";

export const PostCreationBox = props => {
    let user = userInfo.getState();
    return (
        <div className="post-creation-box white-box">
            <div className="avatar-wrapper">
                <Avatar
                    user={user}
                />
            </div>
            <div className="placeholder">
                Hôm nay bạn nghĩ gì, {user.basic_info.username}?
            </div>
        </div>
    )
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
