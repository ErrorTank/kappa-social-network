import React from 'react';
import isNil from "lodash/isNil";
import {userBlockedPosts, userFollowedPosts, userSavedPosts} from "../../../common/states/common";

export const PostActions = ({post, isMyPost, editPost, deletePost, toggleFollow, close, toggleSave, toggleBlock}) => {
    let blockedPosts = userBlockedPosts.getState();
    let savedPosts = userSavedPosts.getState();
    let followedPosts = userFollowedPosts.getState();
    let isSaved = savedPosts.find(each => each === post._id);
    let isFollowed = followedPosts.find(each => each.post === post._id);
    let isBlocked = blockedPosts.find(each => each === post._id);
    let postActions = [
        {
            icon: <i className="fal fa-bookmark"></i>,
            label: () => "Lưu bài viết",
            condition: () => !isSaved,
            onClick: toggleSave
        }, {
            icon: (<><i className="fal fa-bookmark"></i><i className="fal fa-slash"></i></>),
            label: () => "Bỏ lưu bài viết",
            condition: () => isSaved,
            onClick: toggleSave
        }, {
            icon: <i className="fal fa-pen"></i>,
            label: () => "Chỉnh sửa bài viết",
            condition: () => isMyPost,
            onClick: editPost

        }, {
            icon: <i className="fal fa-trash-alt"></i>,
            label: () => "Xóa bài viết",
            condition: () => isMyPost,
            onClick: deletePost
        }, {
            icon: <i className="fal fa-map-marker-times"></i>,
            label: (item) => `Chặn bài viết từ ${item.basic_info.name}`,
            condition: (item) => item.belonged_group || item.belonged_page
        }, {
            icon: <i className="fal fa-bell"></i>,
            label: () => `Bật thông báo cho bài viết`,
            condition: () => !isFollowed,
            onClick: toggleFollow
        }, {
            icon: (<><i className="fal fa-bell"></i><i className="fal fa-slash"></i></>),
            label: () => `Ẩn thông báo từ bài viết`,
            condition: () => isFollowed,
            onClick: toggleFollow
        }, {
            icon: <i className="fal fa-times-square"></i>,
            label: () => "Ẩn bài viết",
            condition: () => !isBlocked,
            onClick: toggleBlock

        },
    ]
    return (
        <div className={"post-actions-dropdown"}>
            {postActions.map((each, i) => (isNil(each.condition) ? true : each.condition?.(each)) ? (
                <div className="setting-row" key={i} onClick={() => {
                    each.onClick();
                    close();
                }}>
                    <div className="icon-wrapper">
                        {each.icon}
                    </div>
                    <div className="label">{each.label(each)}</div>
                </div>
            ) : null)}
        </div>
    );
};

