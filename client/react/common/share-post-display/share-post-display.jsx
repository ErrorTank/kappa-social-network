import React, {Component} from 'react';
import {postApi} from "../../../api/common/post-api";
import {LoadingInline} from "../loading-inline/loading-inline";
import {PostBox} from "../post-box/post-box";

export class SharePostDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            post: null
        }
        if(props.postID){
            postApi.getPostByID(props.postID)
                .then(post => this.setState({post}))
        }
    }

    render() {
        let {loading, post} = this.state;
        return (
            <div className="share-post-display">
                {loading ? (
                    <LoadingInline/>
                ) : (
                    <PostBox
                        isSharePost={true}
                        post={post}
                    />
                )}
            </div>
        );
    }
}

