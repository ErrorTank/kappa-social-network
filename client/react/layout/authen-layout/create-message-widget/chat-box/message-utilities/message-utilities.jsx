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
import {userInfo} from "../../../../../../common/states/common";

export const messageUtilities = {};

export class MessageUtilities extends Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [],
            reply: null
        }
        messageUtilities.addFiles = (files) => {
            this.addNewFiles(files)
        }
        messageUtilities.openReplyPanel = (reply) => {
            this.setState({reply});
            this.input.editor.focus();
        }
    }

    addNewFiles = (files) => {
        this.input.editor.focus();
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
        let {files, reply} = this.state;
        let userID = userInfo.getState()._id;
        return (
            <div className="message-utilities">
                {reply && (
                    <div className="reply-panel">
                        <span>Phản hồi {reply.sentBy._id === userID ? `lại chính bạn` : `tới ${reply.sentBy.basic_info.username}`}</span>
                        <div className={"icon-wrapper"}>

                        </div>
                    </div>
                )}
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
                                    limitSize={10 * 1024 * 1024}
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
                        limitSize={10 * 1024 * 1024}
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
                        limitSize={10 * 1024 * 1024}
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
                            haveFiles={!!this.state.files.length}
                            ref={input => this.input = input}
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
