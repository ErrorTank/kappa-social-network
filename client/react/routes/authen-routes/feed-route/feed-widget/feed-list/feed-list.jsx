import React, {Component} from 'react';
import {InfiniteScrollWrapper} from "../../../../../common/infinite-scroll-wrapper/infinite-scroll-wrapper";

export class FeedList extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }

    }


    render() {
        let {posts} = this.props;
        return (
            <div className="feed-list">
                <div className="list-wrapper">

                </div>

            </div>
        );
    }
}

