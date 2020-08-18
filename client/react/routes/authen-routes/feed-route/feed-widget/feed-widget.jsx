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
            .then(data => {
                if(data){
                    this.props.onCreatePost(data);
                }
            })
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
                    {user.basic_info.username} ơi, bạn đang nghĩ gì thế?
                </div>
            </div>
        )
    }
}




export class FeedWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: []
        }
    }

    appendNewPost = (post) => {
        this.setState({posts: [post].concat(this.state.posts)})
    }

    render() {
        return (
            <div className="feed-widget">
                <PostCreationBox
                    onCreatePost={this.appendNewPost}
                />

            </div>
        );
    }
}
