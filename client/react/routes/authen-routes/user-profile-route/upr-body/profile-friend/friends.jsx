import React, {Component} from 'react';
import {SearchInput} from "../../../../../common/search-input/search-input";
import classnames from "classnames"
import {UserFriendList} from "./user-friend-list/user-friend-list";
import {userApi} from "../../../../../../api/common/user-api";

export class Friends extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: {
                keyword: "",
                mode: "all"

            },
            invitationsCount: 0
        }
        this.getInvitationsCount(props.user._id);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.user._id !== this.props.user._id){
            this.list.fetchFriends({skip: 0, limit: 8})
            this.getInvitationsCount(this.props.user._id);
        }
    }

    getInvitationsCount = (userID) => {
        return userApi.getUserFriendInvitations(userID, {totalOnly: true })
            .then(({total}) => this.setState({invitationsCount: total}))
    }


    render() {
        let {isOwner, onToggleMode, user} = this.props;
        let {filter, invitationsCount} = this.state;
        let {mode, keyword} = filter;
        let filterOptions = [
            {
                label: "Tất cả bạn bè",
                value: "all",
                condition: true
            }, {
                label: "Sinh nhật",
                value: "birthday",
                condition: isOwner
            }, {
                label: "Tỉnh/Thành phố hiện tại",
                value: "same_city",
                condition: isOwner
            }, {
                label: "Bạn chung",
                value: "same_friends",
                condition: !isOwner
            },
        ]
        return (
            <div className="user-friends-tab box-widget">
                <div className="box-widget-header">
                    <div className="bw-route-name">
                        Bạn bè
                    </div>
                    <div className="input-wrapper">
                        <SearchInput
                            value={keyword}
                            onSearch={keyword => this.setState({filter: {...filter, keyword: keyword.trim()}})}
                            placeholder={"Tìm bạn bè..."}
                            debounceSearch={{
                                duration: 300,
                            }}
                        />
                    </div>
                    {isOwner && (
                        <div className="bw-btn ml-3" onClick={onToggleMode}>
                            Lời mời kết bạn ({invitationsCount})
                        </div>
                    )}

                </div>
                <div className="bw-navigators mb-1">
                    {filterOptions.map(each => each.condition ? (
                        <div key={each.value} className={classnames("navigator", {active: each.value === mode})} onClick={() => this.setState({filter: {...filter, mode: each.value}})}>
                            <div className="navigator-label">
                                {each.label}
                            </div>
                        </div>

                    ) : null)}
                </div>
                <UserFriendList
                    mode={mode}
                    ref={list => this.list = list}
                    filter={filter}
                    api={config => {
                        return userApi.getUserFriends(user._id, {...config, ...filter})

                    }}
                />
            </div>
        );
    }
}

