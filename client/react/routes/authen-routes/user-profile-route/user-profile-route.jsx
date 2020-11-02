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

class UserProfileRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            friendStatus: null,
        }
        this.fetchUser(props.match.params.userID);

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
            .then(([user, friendStatus]) => this.setState({user, friendStatus: friendStatus?.value || null}))

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.match.params.userID !== this.props.match.params.userID && this.props.match.params.userID){
            this.fetchUser(this.props.match.params.userID);
        }
    }

    render() {
        let {user, friendStatus} = this.state;

        return (
            <PageTitle
                title={!user ? `Tải thông tin...` : user.basic_info.username}
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