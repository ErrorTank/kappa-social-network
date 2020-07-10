import React, {Component} from 'react';
import {Tooltip} from "../../../../../common/tooltip/tooltip";
import {ChatInput} from "./chat-input/chat-input";
import {InputFileWrapper} from "../../../../../common/file-input/file-input";
import {DropZone} from "../../../../../common/file-input/dropzone";
import {v4 as uuidv4} from 'uuid';
import {isImageFile} from "../../../../../../common/utils/file-upload-utils";
import {FileDisplay} from "./file-display/file-display";
import {Emoji} from 'emoji-mart'
import {messagesContainerUtilities} from "../message-section/message-section";
import {userInfo} from "../../../../../../common/states/common";
import {ThemeContext} from "../../../../../context/theme-context";
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";

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
            return isImageFile(file.name) ? {fileID: uuidv4(), file, type: "image"} : {
                fileID: uuidv4(),
                file,
                type: "common"
            };
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
        this.props.onSubmit({...input, files: this.state.files, reply: this.state.reply});
        this.setState({files: [], reply: null});
    };


    render() {
        let {files, reply} = this.state;
        let userID = userInfo.getState()._id;
        console.log(reply)
        return (
            <ThemeContext.Consumer>
                {({darkMode}) => (
                    <div className="message-utilities">
                        {reply && (
                            <div className="reply-panel">
                                <div className="top-text">
                            <span>Phản hồi tới {reply.file &&
                            <span>{isImageFile(reply.file.name) ? "ảnh" : "file"} của </span>} {reply.sentBy._id === userID ?
                                <span className="high-light">bạn</span> :
                                <span className="high-light">{reply.sentBy.basic_info.username}</span>}</span>
                                </div>
                                {!reply.emoji && !reply.file && (
                                    <div className="content">
                                        {reply.content}
                                    </div>
                                )}
                                {reply.emoji && (
                                    <div className="content">
                                        <Emoji set={'facebook'}
                                               emoji={reply.emoji}
                                               skin={reply.emoji
                                                   ?.skin || 1}
                                               size={16}

                                        />
                                    </div>
                                )}

                                <div className={"icon-wrapper"} onClick={() => this.setState({reply: null})}>
                                    <i className="fal fa-times"></i>
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
                                                <div className="add-file" onClick={onClick}>
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
                                    canMention={this.props.chatRoom?.is_group_chat || true}
                                    onFocusEditor={this.props.onFocusEditor}
                                    haveFiles={!!this.state.files.length}
                                    ref={input => this.input = input}
                                />
                            </div>


                            {this.props.defaultEmoji ? (
                                <Tooltip
                                    text={() => (
                                        <div style={{display: "flex"}}>
                                            <span style={{marginRight: "3px"}}>Gửi </span>
                                            <Emoji
                                                set={'facebook'}
                                                emoji={this.props.defaultEmoji}
                                                size={18}
                                                skin={this.props.defaultEmoji.skin || 1}
                                            />
                                        </div>
                                    )}
                                    position={"top"}
                                >
                                    <div className="icon-wrapper react"
                                         onClick={() => {

                                             this.onSubmit({emoji: this.props.defaultEmoji, content: "huh"})
                                         }}
                                    >
                                        <Emoji
                                            set={'facebook'}
                                            emoji={this.props.defaultEmoji}
                                            skin={this.props.defaultEmoji.skin || 1}
                                            size={24}
                                        />
                                    </div>
                                </Tooltip>
                            ) : (
                                <SkeletonTheme color={darkMode ? "#242526" : "#e3e3e3"}
                                               highlightColor={darkMode ? "#333436" : "#ebebeb"}>
                                    <Skeleton count={1} height={32} width={32} duration={1}
                                              circle={true}/>

                                </SkeletonTheme>
                            )}


                        </div>
                    </div>
                )}
            </ThemeContext.Consumer>

        );
    }
}
