import React, {Component} from 'react';
import {Tooltip} from "../../../../../common/tooltip/tooltip";
import {ChatInput} from "./chat-input/chat-input";
import {InputFileWrapper} from "../../../../../common/file-input/file-input";
import {DropZone} from "../../../../../common/file-input/dropzone";


export class MessageUtilities extends Component {
    constructor(props) {
        super(props);
        this.state = {
            files: []
        }
    }

    handleChangeMediaFile = (file) => {
        console.log(file)

    };

    handleChangeFile = (file) => {
        console.log(file)
    };

    render() {
        return (
            <div className="message-utilities">
                <div className="actions-container">
                    <InputFileWrapper
                        multiple={true}
                        accept={"image/*,image/heif,image/heic,video/*"}
                        onUploaded={this.handleChangeMediaFile}
                        limitSize={5 * 1024 * 1024}
                    >
                        {({onClick}) => (
                            <Tooltip text={() => "Gắn ảnh hoặc video"} position={"top"}>
                                <div className="icon-wrapper" onClick={onClick}>
                                    <i className="far fa-photo-video"></i>
                                </div>
                            </Tooltip>
                        )}
                    </InputFileWrapper>
                    <InputFileWrapper
                        multiple={true}
                        accept={"*"}
                        onUploaded={this.handleChangeFile}
                        limitSize={5 * 1024 * 1024}
                    >
                        {({onClick}) => (
                            <Tooltip text={() => "Đính kèm file"} position={"top"}>
                                <div className="icon-wrapper" onClick={onClick}>
                                    <i className="far fa-paperclip"></i>
                                </div>
                            </Tooltip>
                        )}

                    </InputFileWrapper>
                    <div className="chat-input-wrapper">
                        <ChatInput/>
                    </div>
                    <Tooltip text={() => "Gửi"} position={"top"}>
                        <div className="icon-wrapper react">
                            <i className="fas fa-thumbs-up"></i>
                        </div>
                    </Tooltip>
                </div>
            </div>
        );
    }
}
