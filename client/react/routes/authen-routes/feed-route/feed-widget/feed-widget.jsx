import React, {Component} from 'react';
import {userInfo} from "../../../../../common/states/common";
import {Avatar} from "../../../../common/avatar/avatar";
import {createPostModal} from "../../../../common/create-post-modal/create-post-modal";
import {postApi} from "../../../../../api/common/post-api";
import {FeedList} from "./feed-list/feed-list";
import {LoadingInline} from "../../../../common/loading-inline/loading-inline";



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
        this.props.onChange([post].concat(this.props.posts))
    }


    changePost = (postID, post, index) => {
        let newPosts = [...this.props.posts];
        // console.log(newPosts)
        newPosts.splice(index, 1, post);
        this.props.onChange(newPosts);
    }

    deletePost = (post, i) => {
        let {posts, onChange} = this.props;
        onChange(posts.filter(each => each._id !== post._id));
    }

    render() {
        let {posts, loading, needReloaded, onReload} = this.props;
        return (
            <div className="feed-widget">
                <PostCreationBox
                    onCreatePost={this.appendNewPost}
                />
                <FeedList
                    posts={posts}
                    onChangePost={this.changePost}
                    onDeletePost={this.deletePost}
                    onAddPost={this.appendNewPost}
                    onUpdatePost={this.updatePost}
                />
                {loading && (
                    <div className="loading-panel">
                        <LoadingInline/>
                    </div>
                )}
                {needReloaded && (
                    <div className="need-reloaded white-box">
                        <p className="til">Co vẻ như không còn bài đăng nào.</p>
                        <button className="btn btn-common-primary btn-reloaded" onClick={onReload}>Tải lại</button>
                    </div>
                )}
            </div>
        );
    }
}
