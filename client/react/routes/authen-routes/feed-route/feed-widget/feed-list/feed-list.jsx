import React, {Component} from 'react';
import {InfiniteScrollWrapper} from "../../../../../common/infinite-scroll-wrapper/infinite-scroll-wrapper";
import {PostBox} from "../../../../../common/post-box/post-box";
import {userInfo} from "../../../../../../common/states/common";

export class FeedList extends Component {
    constructor(props) {
        super(props);
        this.state = {


        }

    }


    render() {
        let {posts, onChangePost} = this.props;
        let user = userInfo.getState();
        return (
            <div className="feed-list">
                <div className="list-wrapper">
                    {posts.map((each, i) => (
                        <PostBox
                            key={each._id}
                            post={each}
                            isMyPost={user._id === each.belonged_person._id}
                            onChangePost={(post) => onChangePost(each._id, post, i)}
                        />
                    ))}
                </div>

            </div>
        );
    }
}

