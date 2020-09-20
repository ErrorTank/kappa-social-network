import React from 'react';
import {CoverPhotoUploader} from "./cover-photo-uploader";
import {AvatarUploader} from "./avatar-uploader";
import {userInfo} from "../../../../../common/states/common";
import {UserBasicInfo} from "./user-basic-info";
import {ProfileNavigator, USER_FRIEND_RELATION} from "./profile-navigator";
import {userApi} from "../../../../../api/common/user-api";



export class UprHeader extends React.Component {
    constructor(props) {
        super(props);
        let isOwner = props.user._id === userInfo.getState()._id;
        this.state = {
            friendStatus: null,
            loadIsFriend: !isOwner
        }
        if (!isOwner) {
            this.checkIsFriend(props.user._id)
        }
    }

    checkIsFriend = (friendID) => {
        userApi.checkIsFriend(userInfo.getState()._id, friendID)
            .then(({value}) => {
                this.setState({loadIsFriend: false, friendStatus: value})
            })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.user._id !== this.props.user._id) {
            if (!this.props.isOwner) {
                this.checkIsFriend(this.props.user._id)
            }
        }
    }


    render() {
        let { friendStatus, loadIsFriend} = this.state;
        let {user} = this.props;
        let { _id} = user;
        let isOwner = _id === userInfo.getState()._id;
        return (
            <div className="upr-header">
                <div className="common-container">
                    <div className="user-avatar-section">
                        <CoverPhotoUploader
                            user={user}
                            isOwner={isOwner}
                        />
                        <AvatarUploader
                            user={user}
                            isOwner={isOwner}

                        />

                    </div>
                    <UserBasicInfo
                        user={user}
                        isOwner={isOwner}
                    />
                    {!loadIsFriend && (
                        <ProfileNavigator
                            user={user}
                            isOwner={isOwner}
                            friendStatus={friendStatus}
                            onUnfriend={() => this.setState({friendStatus: USER_FRIEND_RELATION.NOT_FRIEND})}
                            onSentFriendRequest={() =>  this.setState({friendStatus: USER_FRIEND_RELATION.PENDING})}
                            onCancelRequest={() =>  this.setState({friendStatus: USER_FRIEND_RELATION.NOT_FRIEND})}
                        />
                    )}

                </div>
            </div>
        );
    }
}



