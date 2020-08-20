import React, {Component} from 'react';
import {PageTitle} from "../../../common/page-title/page-title";
import {ChatWidget} from "./chat-widget/chat-widget";
import {CommonLayout} from "../../../layout/common-layout/common-layout";
import {NavigationWidget} from "./navigation-widget/navigation-widget";
import {FeedWidget} from "./feed-widget/feed-widget";
import {postApi} from "../../../../api/common/post-api";
import {FeedList} from "./feed-widget/feed-list/feed-list";
import {InfiniteScrollWrapper} from "../../../common/infinite-scroll-wrapper/infinite-scroll-wrapper";

class FeedRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            skip: 0,
            limit: 5,
            needReloaded: false
        }
        this.fetchPostsForFeed({skip: 0, limit: 5})
    }

    fetchPostsForFeed = (config) => {
        return postApi.getPostsForFeed(config)
            .then(posts => {
                this.setState({
                    skip: this.state.posts.length + posts.length,
                    needReloaded: posts.length < 5,
                    posts: this.state.posts.concat(posts)
                })
            })
    }


    render() {
        let {posts} = this.state;
        return (
            <PageTitle
                title={"Trang chủ"}
            >
                <InfiniteScrollWrapper
                    onScrollBottom={this.fetchPostsForFeed}
                >
                    {() => (
                        <div className="feed-route">
                            <CommonLayout
                                rightRender={() => (
                                    <ChatWidget/>
                                )}
                                leftRender={() => (
                                    <NavigationWidget/>
                                )}
                                mainRender={() => (
                                    <FeedWidget
                                        posts={posts}
                                        onChange={posts => this.setState({posts})}
                                    />
                                )}
                            />
                        </div>
                    )}
                </InfiniteScrollWrapper>

            </PageTitle>
        );
    }
}

export default FeedRoute;