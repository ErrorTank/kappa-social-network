import React, {Component} from 'react';
import {PageTitle} from "../../../common/page-title/page-title";
import {InfiniteScrollWrapper} from "../../../common/infinite-scroll-wrapper/infinite-scroll-wrapper";
import {CommonLayout} from "../../../layout/common-layout/common-layout";
import {ChatWidget} from "../feed-route/chat-widget/chat-widget";
import {NavigationWidget} from "../feed-route/navigation-widget/navigation-widget";
import {FeedWidget} from "../feed-route/feed-widget/feed-widget";
import {PostContainer} from "./post-container";
import {postApi} from "../../../../api/common/post-api";
import {parseQueryString} from "../../../../common/utils/string-utils";

class PostRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            belonged_person: null
        }


    }

    render() {
        let {belonged_person} = this.state;
        return (
            <PageTitle
                title={!belonged_person ? "Tải nội dung..." : `Bài đăng của ${belonged_person.basic_info.username}`}
            >
                <div className="feed-infinite overflow-y">
                    <div className="post-route">
                        <CommonLayout
                            rightRender={() => (
                                <ChatWidget/>
                            )}
                            leftRender={() => (
                                <NavigationWidget/>
                            )}
                            mainRender={() => (
                                <PostContainer
                                    postID={this.props.match.params.postID}
                                    params={parseQueryString(this.props.location.search)}
                                    api={(postID) =>  postApi.getPostByID(postID)
                                        .then(post => {
                                            this.setState({belonged_person: post.belonged_person})
                                            return post;
                                        })}
                                />
                            )}
                        />
                    </div>
                </div>


            </PageTitle>

        );
    }
}

export default PostRoute;