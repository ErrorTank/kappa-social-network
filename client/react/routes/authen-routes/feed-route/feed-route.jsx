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
import debounce from "lodash/debounce"


class FeedRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            fetching: true,
            needReloaded: false
        }
        this.fetchPostsForFeed()

    }

    fetchPostsForFeed = () => {
        return postApi.getPostsForFeed({skip: this.state.posts.length, limit: 5})
            .then(posts => {
                this.setState({
                    posts: this.state.posts.concat(posts),
                    fetching: false,
                    needReloaded: posts.length < 5
                })
            })
    }

    reload = () => {

        this.setState({loading: true, posts: [], neededReload: false}, () => {

            // console.log("Cac")
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            this.fetchPostsForFeed();
        });

    }

    debounceLoad = debounce(() => {
        let {posts, needReloaded} = this.state;
        if(!needReloaded === !this.state.fetching){
            this.setState({fetching: true}, () => {

                this.fetchPostsForFeed()
            })

        }
    }, 500)


    render() {
        let {posts, fetching, needReloaded} = this.state;

        return (
            <PageTitle
                title={"Trang chủ"}
            >
                <InfiniteScrollWrapper
                    // className={"feed-infinite"}
                    useWindowRoot
                    onScrollBottom={() => {
                        this.debounceLoad();

                    }}
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
                                        observer={this.observer}
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