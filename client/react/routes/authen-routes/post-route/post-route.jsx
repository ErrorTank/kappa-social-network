import React, {Component} from 'react';
import {PageTitle} from "../../../common/page-title/page-title";
import {InfiniteScrollWrapper} from "../../../common/infinite-scroll-wrapper/infinite-scroll-wrapper";
import {CommonLayout} from "../../../layout/common-layout/common-layout";
import {ChatWidget} from "../feed-route/chat-widget/chat-widget";
import {NavigationWidget} from "../feed-route/navigation-widget/navigation-widget";
import {FeedWidget} from "../feed-route/feed-widget/feed-widget";

class PostRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            post: null,
            loading: true
        }
    }

    render() {
        let {post, loading} = this.state;
        return (
            <PageTitle
                title={loading ? "Tải nội dung..." : "T"}
            >
                <InfiniteScrollWrapper
                    className={"feed-infinite"}
                    onScrollBottom={() => {
                        this.debounceLoad();

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

export default PostRoute;