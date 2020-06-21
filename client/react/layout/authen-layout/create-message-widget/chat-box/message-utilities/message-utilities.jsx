import React, {Component} from 'react';
import {Tooltip} from "../../../../../common/tooltip/tooltip";
import {ChatInput} from "./chat-input/chat-input";
import {InputFileWrapper} from "../../../../../common/file-input/file-input";
import {DropZone} from "../../../../../common/file-input/dropzone";
import { v4 as uuidv4 } from 'uuid';
import {isImageFile} from "../../../../../../common/utils/file-upload-utils";
import {FileDisplay} from "./file-display/file-display";
import {getURLsFromText} from "../../../../../../common/utils/string-utils";
import {messagesContainerUtilities} from "../message-section/message-section";

export const messageUtilities = {};

export class MessageUtilities extends Component {
    constructor(props) {
        super(props);
        this.state = {
            files: []
        }
        messageUtilities.addFiles = (files) => {
            this.addNewFiles(files)
        }
    }

    addNewFiles = (files) => {
        let newFiles = Array.from(files).map(file => {
            return isImageFile(file.name) ? {fileID: uuidv4(), file, type: "image"} : {fileID: uuidv4(), file, type: "common"};
        })
        let scrollToLatest = messagesContainerUtilities.createScrollLatest();
        setTimeout(() => scrollToLatest())
        this.setState({files: this.state.files.concat(newFiles)});
    };

    handleChangeMediaFiles = (files) => {

        this.addNewFiles(files)

    };

    handleChangeFiles = (files) => {

        this.addNewFiles(files)
    };

    removeFile = fileID => {
        this.setState({files: this.state.files.filter(file => file.fileID !== fileID)});
    }

    onSubmit = (input) => {
        this.props.onSubmit({...input, files: this.state.files});
        this.setState({files: []});
    };



    render() {
        let {files} = this.state;

        return (
            <div className="message-utilities">
                {!!files.length && (
                    <div className="files-display">
                        <div className="files-container">
                            {files.map(file => (
                                <FileDisplay
                                    key={file.fileID}
                                    file={file}
                                    onClose={() => this.removeFile(file.fileID)}
                                />
                            ))}
                            {!!files.length && (
                                <InputFileWrapper
                                    multiple={true}
                                    accept={"*"}
                                    onUploaded={this.handleChangeFiles}
                                    limitSize={5 * 1024 * 1024}
                                >
                                    {({onClick}) => (
                                        <div className="add-file" onClick={onClick} >
                                            <i className="fal fa-file-plus"></i>
                                        </div>
                                    )}

                                </InputFileWrapper>
                            )}
                        </div>
                    </div>
                )}
                <div className="actions-container">
                    <InputFileWrapper
                        multiple={true}
                        accept={"image/*,image/heif,image/heic,video/*"}
                        onUploaded={this.handleChangeMediaFiles}
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
                        onUploaded={this.handleChangeFiles}
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
                        <ChatInput
                            chatRoomID={this.props.chatRoom?._id}
                            onSubmit={this.onSubmit}
                            canMention={this.props.chatRoom?.is_group_chat}
                            onFocusEditor={this.props.onFocusEditor}
                        />
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
