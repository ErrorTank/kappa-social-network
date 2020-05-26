import React, {Component} from 'react';
import {PageTitle} from "../../../common/page-title/page-title";
import {ChatWidget} from "./chat-widget/chat-widget";
import {CommonLayout} from "../../../layout/common-layout/common-layout";
import {NavigationWidget} from "./navigation-widget/navigation-widget";

class FeedRoute extends Component {
    constructor(props) {
        super(props);
    }
    render() {

        return (
            <PageTitle
                title={"Trang chủ"}
            >
                <div className="feed-route">
                    <CommonLayout
                        rightRender={() => (
                            <ChatWidget/>
                        )}
                        leftRender={() => (
                            <NavigationWidget/>
                        )}
                    />
                </div>
            </PageTitle>
        );
    }
}

export default FeedRoute;