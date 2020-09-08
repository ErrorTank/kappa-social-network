import React, {Component} from 'react';
import {getRenderableContentFromMessage} from "../../../common/utils/editor-utils";
import {Avatar} from "../avatar/avatar";
import {Emoji} from "emoji-mart";

export class PostNotification extends Component {



    getRenderData = (data) => {
        let {type} = this.props;
        const dataMatcher = {
            "comment_on_your_post": {
                getAvatarUser: () => data.from_person,
                getReaction: () => null,
                getContent: () => (
                    <span>
                        {data.from_person.basic_info.username} đã bình luận về bài viết của bạn: <span>{getRenderableContentFromMessage(data)}</span>
                    </span>
                )
            }
        }
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

