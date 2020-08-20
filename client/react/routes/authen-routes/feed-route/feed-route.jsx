import React, {Component} from 'react';
import ReactDOM from "react-dom";
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
            fetching: true
        }
        this.fetchPostsForFeed()
    }

    fetchPostsForFeed = () => {
        return postApi.getPostsForFeed({skip: this.state.posts.length, limit: 5})
            .then(posts => {
                this.setState({
                    posts: this.state.posts.concat(posts),
                    fetching: false
                })
            })
    }

    reload = () => {

        this.setState({loading: true, posts: []}, () => {
            let routeWrapper = ReactDOM.findDOMNode(this.feedRoute);
            routeWrapper.scrollTop = 0;
            this.fetchPostsForFeed();
        });

    }

    render() {
        let {posts, fetching} = this.state;
        let needReloaded = !(posts.length % 5 === 0 && posts.length > 0);
        return (
            <PageTitle
                title={"Trang chủ"}
            >
                <InfiniteScrollWrapper
                    onScrollBottom={() => {
                        if(!needReloaded){
                            this.setState({fetching: true})
                            this.fetchPostsForFeed()
                        }
                    }}
                >
                    {() => (
                        <div className="feed-route" ref={feedRoute => this.feedRoute = feedRoute}>
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
                                        loading={fetching}
                                        needReloaded={needReloaded}
                                        onReload={this.reload}
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