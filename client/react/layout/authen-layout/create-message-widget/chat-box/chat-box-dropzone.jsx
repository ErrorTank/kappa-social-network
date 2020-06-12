import React, {Component} from 'react';
import {DropZone} from "../../../../common/file-input/dropzone";

export class ChatBoxDropZone extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    handleUploadFiles = (file) => {
        console.log(file)
        return Promise.resolve();
    }

    render() {
        return (
            <DropZone
                name="chat-box-file-upload"
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
