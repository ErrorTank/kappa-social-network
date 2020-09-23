import React, {Component} from 'react';
import {SearchInput} from "../../../../../common/search-input/search-input";

export class FriendInvitations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: "",
            list: [],
            total: 0
        }
    }

    render() {
        let {keyword, list, total} = this.state;
        return (
            <div className="friend-invitations-tab box-widget">
                <div className="pfsr-header">
                    <div className="route-name">
                        Lời mời kết bạn <span className="high-light">{total}</span>
                    </div>
                    <div className="input-wrapper">
                        <SearchInput
                            onSearch={keyword => this.setState({keyword})}
                            placeholder={"Tìm lời mời..."}
                        />
                    </div>
                    <div className="">

                    </div>
                </div>
            </div>
        );
    }
}

