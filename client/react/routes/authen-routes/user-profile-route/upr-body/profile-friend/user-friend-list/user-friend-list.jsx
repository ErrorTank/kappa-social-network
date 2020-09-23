import React, {Component} from 'react';
import isEqual from "lodash/isEqual";
import {InfiniteScrollWrapper} from "../../../../../../common/infinite-scroll-wrapper/infinite-scroll-wrapper";
import debounce from "lodash/debounce";
import {Avatar} from "../../../../../../common/avatar/avatar";
import {Button} from "../../../../../../common/button/button";
import moment from "moment"
import {LoadingInline} from "../../../../../../common/loading-inline/loading-inline";
import {userInfo} from "../../../../../../../common/states/common";
import {Link} from "react-router-dom";

moment.locale("vi");
//TODO Invitation status in userbox
export class UserBox extends Component {
    render() {
        let {mode, user} = this.props;
        return (
            <div className="user-box">
                <div className="avatar-wrapper">
                    <Avatar
                        user={user}
                        circle={false}
                    />
                </div>
                {user._id !== userInfo.getState()._id ? (
                    <>
                        <div className="info">
                            <div className="username">
                                <Link to={`/user/${user._id}`}>
                                    {user.basic_info.username}
                                </Link>
                            </div>
                            <div className="sub">
                                {mode === "birthday" ? (
                                    <span><i
                                        className="fad fa-birthday-cake"></i> {moment().to(new Date().getTime() + user.birthday_countdown)}</span>
                                ) : user.same_friends_count > 0 ? (
                                    <span>{user.same_friends_count} bạn chung</span>
                                ) : null}
                            </div>
                        </div>
                        <Button className="btn-grey action">
                            {user.is_caller_friend ? "Bạn bè" : "Thêm bạn bè"}
                        </Button>
                    </>
                ) : (
                    <>
                        <div className="info">
                            <div className="username">
                                <Link to={`/user/${user._id}`}>
                                    {user.basic_info.username}
                                </Link>
                            </div>

                        </div>

                    </>
                )}

            </div>
        )
    }
}

export class UserFriendList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            total: 0,
            loading: true
        }
        this.fetchFriends({
            skip: 0,
            limit: 8
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!isEqual(prevProps.filter, this.props.filter)) {
            this.setState({list: [], total: 0, loading: true}, () => {
                setTimeout(() => {
                    this.fetchFriends({
                        skip: 0,
                        limit: 8
                    })
                }, 200)
            })
        }
    }

    debounceLoad = debounce(() => {
        let {total, list} = this.state;
        if (total > list.length) {
            this.setState({loading: true}, () => {
                this.fetchFriends({
                    skip: 0,
                    limit: 8
                })
            })


        }
    }, 300)

    fetchFriends = (config) => {
        this.props.api(config)
            .then(({list, total}) => this.setState({list: this.state.list.concat(list), total, loading: false}))
    }

    render() {
        let {list, loading} = this.state;
        let {mode} = this.props;
        return (
            <>
                {loading && (
                    <div style={{height: "200px", position: "relative"}}>
                        <LoadingInline/>
                    </div>

                )}
                <InfiniteScrollWrapper
                    useWindowRoot
                    onScrollBottom={() => {
                        this.debounceLoad();

                    }}
                >
                    {() => (
                        <div className="user-friend-list">

                            {list.map(each => (
                                <UserBox
                                    key={each._id}
                                    user={each}
                                    mode={mode}
                                />
                            ))}
                        </div>
                    )}
                </InfiniteScrollWrapper>
            </>

        );
    }
}
