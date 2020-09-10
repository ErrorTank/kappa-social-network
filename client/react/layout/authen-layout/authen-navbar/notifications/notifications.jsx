import React, {Component} from 'react';
import {userApi} from "../../../../../api/common/user-api";
import {InfiniteScrollWrapper} from "../../../../common/infinite-scroll-wrapper/infinite-scroll-wrapper";
import classnames from "classnames";
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';
import {PostNotification} from "../../../../common/post-notification/post-notification";


export class Notifications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notifications: [],
            skip: 0,
            fetching: true,
            total: 0
        }
        this.fetchNotifications(true)

    }

    fetchNotifications = (force = false) => {
        if(this.state.notifications.length < this.state.total || force){
            return userApi.getUserNotifications(this.state.skip).then(({notifications, total}) => {
                this.props.onSeen(notifications.filter(each => !each.is_seen));
                this.setState({
                    notifications: this.state.notifications.concat(notifications),
                    skip: this.state.skip + 7,
                    fetching: false,
                    total
                })
            })
        }


    }

    render() {
        let {notifications, fetching} = this.state;
        return (
            <div className="notifications nav-bar-dropdown">
                <div className="nbd-title">
                    Thông báo
                </div>
                <InfiniteScrollWrapper
                    className={"notifications-wrapper"}
                    onScrollBottom={() => {
                        this.fetchNotifications();

                    }}


                >
                    {() => (
                        <div className="nbd-content">
                            {(!notifications.length && !fetching) ? (
                                <div className="empty-notify">
                                    Bạn không có thông báo nào
                                </div>
                            ) : notifications.map(each => (
                                <PostNotification
                                    highLight
                                    key={each._id}
                                    notification={each}
                                    isPopup={false}
                                />
                            ))}
                            {fetching && (
                                <SkeletonTheme color={"#e3e3e3"}
                                               highlightColor={"#ebebeb"}>
                                    <div className={classnames("post-notification")}>

                                        <div className="avatar-wrapper">
                                            <Skeleton count={1} height={40} width={40} duration={1} circle={true}/>
                                        </div>
                                        <div className="content-wrapper">
                                            <Skeleton count={1} height={50} width={250} duration={1}/>
                                        </div>


                                    </div>
                                </SkeletonTheme>
                            )}
                        </div>
                    )}
                </InfiniteScrollWrapper>
            </div>
        );
    }
}

