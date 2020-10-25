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

    }





    render() {
        let {user, friendStatus, onChangeStatus} = this.props;
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
                    <ProfileNavigator
                        user={user}
                        isOwner={isOwner}
                        friendStatus={friendStatus}
                        onUnfriend={() => onChangeStatus(USER_FRIEND_RELATION.NOT_FRIEND)}
                        onSentFriendRequest={() =>  onChangeStatus( USER_FRIEND_RELATION.PENDING)}
                        onCancelRequest={() =>  onChangeStatus(USER_FRIEND_RELATION.NOT_FRIEND)}
                    />


                </div>
            </div>
        );
    }
}



