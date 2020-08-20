import React, {Component} from 'react';
import {userInfo} from "../../../../../common/states/common";
import {Avatar} from "../../../../common/avatar/avatar";
import {createPostModal} from "../../../../common/create-post-modal/create-post-modal";
import {postApi} from "../../../../../api/common/post-api";
import {FeedList} from "./feed-list/feed-list";



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

        }

    }
    appendNewPost = (post) => {
        this.props.onChange({posts: [post].concat(this.props.posts)})
    }


    render() {
        let {posts} = this.props;
        return (
            <div className="feed-widget">
                <PostCreationBox
                    onCreatePost={this.appendNewPost}
                />
                <FeedList
                    posts={posts}
                />
            </div>
        );
    }
}
