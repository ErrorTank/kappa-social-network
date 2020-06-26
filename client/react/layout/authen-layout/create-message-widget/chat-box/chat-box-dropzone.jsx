import React, {Component} from 'react';
import {DropZone} from "../../../../common/file-input/dropzone";
import {messageUtilities} from "./message-utilities/message-utilities";

export class ChatBoxDropZone extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    handleUploadFiles = (files) => {
        messageUtilities.addFiles(files);
        return Promise.resolve();
    }

    render() {
        return (
            <DropZone
                name="chat-box-file-upload"
                limitSize={10 * 1024 * 1024}
                className="background-dropzone"
                multiple={true}
                dropPlaceHolder={(
                    <div className="background-dropzone-placeholder">
                        <span>Thả files vào đây</span>
                    </div>
                )}
                onChange={(files) => this.handleUploadFiles(files)}
            />
        );
    }
}
