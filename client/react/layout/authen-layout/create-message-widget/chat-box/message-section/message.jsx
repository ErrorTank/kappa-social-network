import React, {Component} from 'react';
import classnames from "classnames"
import {userInfo} from "../../../../../../common/states/common";
import {getRenderableContentFromMessage} from "../../../../../../common/utils/editor-utils";

export class Message extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        let userID = userInfo.getState()._id;
        let {message, position, haveAvatar} = this.props;
        return (
            <div className={classnames("chat-message")}>
                <div className={classnames("message-renderable-content", position, {owned: message.sentBy === userID})}>
                    {getRenderableContentFromMessage(message)}
                </div>
            </div>
        );
    }
}
