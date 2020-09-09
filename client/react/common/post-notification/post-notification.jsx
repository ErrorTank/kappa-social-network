import React, {Component} from 'react';
import {getRenderableContentFromMessage} from "../../../common/utils/editor-utils";
import {Avatar} from "../avatar/avatar";
import {Emoji} from "emoji-mart";
import {userInfo} from "../../../common/states/common";

export class PostNotification extends Component {



    getRenderData = (data) => {
        let {type} = this.props;
        const dataMatcher = {

            "comment_on_followed_post": {
                getAvatarUser: () => data.from_person,
                getReaction: () => null,
                getContent: () => (
                    <span>
                        <span className="high-light dark">{data.from_person.basic_info.username}</span> đã bình luận về <span  className="high-light dark">bài viết</span> {data.post.belonged_person._id === userInfo.getState()._id ? "của bạn" : "mà bạn đang theo dõi"}: <span>{getRenderableContentFromMessage(data)}</span>
                    </span>
                )
            }
        };
        return dataMatcher[type]

    }

    render() {
        let {data} = this.props;
        let {getAvatarUser, getReaction, getContent} = this.getRenderData(data);
        let reaction = getReaction();
        return (
            <div className="post-notification">
                <div className="avatar-wrapper">
                    <Avatar user={getAvatarUser()}/>
                    {reaction && (
                        <div className="reaction">
                            <Emoji set={'facebook'}
                                   emoji={reaction}
                                   size={35}
                            />
                        </div>
                    )}
                </div>
                <div className="content-wrapper">
                    {getContent()}
                </div>
            </div>
        );
    }
}

