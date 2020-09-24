import React, {Component} from 'react';
import {SearchInput} from "../../../../../common/search-input/search-input";
import {userApi} from "../../../../../../api/common/user-api";
import {UserFriendList} from "./user-friend-list/user-friend-list";

export class FriendInvitations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: "",
            total: 0
        }
    }



    render() {
        let {keyword, total} = this.state;
        let {onToggleMode, user} = this.props;
        return (
            <div className="friend-invitations-tab box-widget">
                <div className="box-widget-header">
                    <div className="bw-route-name">
                        Lời mời kết bạn <span className="high-light">{total}</span>
                    </div>
                    <div className="input-wrapper">
                        <SearchInput
                            value={keyword}
                            onSearch={keyword => this.setState({keyword})}
                            placeholder={"Tìm lời mời..."}
                            debounceSearch={{
                                duration: 300,
                            }}
                        />
                    </div>
                    <div className="bw-btn ml-3" onClick={onToggleMode}>
                        Danh sách bạn bè
                    </div>
                </div>
                <UserFriendList
                    mode={"invitation"}
                    ref={list => this.list = list}
                    filter={{
                        keyword
                    }}
                    onChangeTotal={total => this.setState({total})}
                    api={config => {
                        return userApi.getUserFriendInvitations(user._id, {...config, keyword})
                            .then(data => {
                                this.setState({total: data.total})
                                return data;
                            })
                    }}
                />
            </div>
        );
    }
}

