import React, {Component} from 'react';
import {MessageFileDisplay} from "../message-file-display";
import classnames from "classnames"
import {getRenderableContentFromMessage} from "../../../../../../../common/utils/editor-utils";

export class ReplyContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }
    render() {
        let {message, isOwned} = this.props;
        return (
            <div className={classnames("reply-content", {owned :isOwned})}>
                {message.file ? (
                    <MessageFileDisplay
                        file={message.file}
                        needUpload={message.needUploadFile}
                    />
                ) : (
                    <div className="content">
                        {getRenderableContentFromMessage(message)}
                    </div>
                )}
            </div>
        );
    }
}
