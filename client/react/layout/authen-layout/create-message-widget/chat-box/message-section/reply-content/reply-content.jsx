import React, {Component} from 'react';
import {MessageFileDisplay} from "../message-file-display";
import classnames from "classnames"
import {getRenderableContentFromMessage} from "../../../../../../../common/utils/editor-utils";
import {Emoji} from "emoji-mart";

export class ReplyContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }
    render() {
        let {message, isOwned} = this.props;
        return (
            <div className={classnames("reply-content", {owned :isOwned, emoji: message.emoji})}>
                {message.file ? (
                    <MessageFileDisplay
                        file={message.file}
                        needUpload={message.needUploadFile}
                    />
                ) : message.emoji ? (
                    <div className="emoji-wrapper">
                        <Emoji set={'facebook'}
                               emoji={message.emoji}
                               skin={message.emoji
                                   ?.skin || 1}
                               size={35}

                        />
                    </div>
                ) : (
                    <div className="content">
                        {getRenderableContentFromMessage(message)}
                    </div>
                )}
            </div>
        );
    }
}
