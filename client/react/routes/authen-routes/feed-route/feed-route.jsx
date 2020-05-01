import React, {Component} from 'react';
import {PageTitle} from "../../../common/page-title/page-title";

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

                </div>
            </PageTitle>
        );
    }
}

export default FeedRoute;