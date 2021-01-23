import React, {Component} from 'react';
import {PageTitle} from "../../../common/page-title/page-title";
import {CommonLayout} from "../../../layout/common-layout/common-layout";
import {userApi} from "../../../../api/common/user-api";
import {UprHeader} from "./upr-header/upr-header";
import {UprBody} from "./upr-body/upr-body";
import {userInfo} from "../../../../common/states/common";
import {USER_FRIEND_RELATION} from "./upr-header/profile-navigator";
import {topFloatNotifications} from "../../../common/float-top-notification/float-top-notification";
import {customHistory} from "../../routes";
import {Link} from "react-router-dom";
import { KComponent } from '../../../common/k-component';

class UserProfileRoute extends KComponent {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            friendStatus: null,
            username: ''
        }
        this.fetchUser(props.match.params.userID);
        this.onUnmount(userInfo.onChange((nextState) => {
            let username = nextState.basic_info.username
            this.setState({
                username
                
            })
        }))
    }

    fetchUser = userID => {

        let promises = [
            userApi.getUserBasicInfo(userID)
                .catch(() => {

                    topFloatNotifications.actions.push({
                        content: (
                            <p className="common-noti-layout danger">
                                <i className="far fa-exclamation-circle"></i>
                                <span>Người dùng này không tồn tại hoặc đã bị chặn. Xem <Link to={"/settings/blocked"}>danh sách chặn</Link>.</span>
                            </p>
                        )
                    });
                    customHistory.push("/")
                    return Promise.reject()
            })
        ]
        let user = userInfo.getState();
        if(userID !== user._id && userID !== user.basic_info.profile_link){
            promises.push(userApi.checkIsFriend(userInfo.getState()._id, userID));
        }
        Promise.all(promises)
            .then(([user, friendStatus]) => this.setState({user, friendStatus: friendStatus?.value || null, username: user.basic_info.username}))

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.match.params.userID !== this.props.match.params.userID && this.props.match.params.userID){
            this.fetchUser(this.props.match.params.userID);
        }
    }

    render() {
        let {user, friendStatus, username} = this.state;

        return (
            <PageTitle
                title={!username ? `Tải thông tin...` : username}
            >
                <div className="user-profile-route">
                    <CommonLayout
                        extendMain={true}
                        haveLeftRender={false}
                        haveRightRender={false}
                        mainRender={() => user ? (
                            <div className="upr-wrapper">
                                <UprHeader
                                    user={user}
                                    friendStatus={friendStatus}
                                    onChangeStatus={(friendStatus) => this.setState({friendStatus})}
                                />
                                <UprBody
                                    user={user}
                                    renderChildRoute={this.props.children}
                                    friendStatus={friendStatus}
                                />
                            </div>
                        ) : null}
                    />
                </div>

            </PageTitle>

        );
    }
}

export default UserProfileRoute;