import React from 'react';
import {CoverPhotoUploader} from "./cover-photo-uploader";
import {AvatarUploader} from "./avatar-uploader";
import {userInfo} from "../../../../../common/states/common";
import {UserBasicInfo} from "./user-basic-info";

export const UprHeader = ({user}) => {
    let {avatar, cover_photo, _id} = user;
    let isOwner = _id === userInfo.getState()._id;
    return (
        <div className="upr-header">
            <div className="common-container">
                <div className="user-avatar-section">
                    <CoverPhotoUploader
                        user={user}
                        src={cover_photo}
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
            </div>
        </div>
    );
};

