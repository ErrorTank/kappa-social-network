import React from 'react';
import {CoverPhotoUploader} from "./cover-photo-uploader";
import {AvatarUploader} from "./avatar-uploader";
import {userInfo} from "../../../../../common/states/common";
import {UserBasicInfo} from "./user-basic-info";
import {ProfileNavigator} from "./profile-navigator";

export const UprHeader = ({user}) => {
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
                />
            </div>
        </div>
    );
};

