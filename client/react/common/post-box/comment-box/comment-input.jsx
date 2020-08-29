import React, {Component} from 'react';
import createMentionPlugin from "draft-js-mention-plugin";
import Editor, {createEditorStateWithText} from 'draft-js-plugins-editor';

import classnames from "classnames";
import debounce from "lodash/debounce";
import {isImageFile} from "../../../../common/utils/file-upload-utils";
import {v4 as uuidv4} from 'uuid';

import {userInfo} from "../../../../common/states/common";
import {CreatePostDropZone} from "../../create-post-modal/create-post-main/create-post-main";
import {Avatar} from "../../avatar/avatar";
import {Tooltip} from "../../tooltip/tooltip";
import {ClickOutside} from "../../click-outside/click-outside";
import {InputFileWrapper} from "../../file-input/file-input";
import Draft, {ContentState, convertToRaw, EditorState} from "draft-js";
import data from 'emoji-mart/data/facebook.json';
import createEmojiMartPlugin from "draft-js-emoji-mart-plugin";
import {CommentMedia} from "./comment-media";
import {transformEditorState} from "../../../../common/utils/editor-utils";
import {postApi} from "../../../../api/common/post-api";


export class CommentInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadSuggestion: true,
            showEmojiPicker: false,
            filteredSuggestions: [],
            editorState: createEditorStateWithText(""),
            files: [],
            loading: false
        }
        this.mentionPlugin = createMentionPlugin({
            entityMutability: 'IMMUTABLE',
            supportWhitespace: true,
            // positionSuggestions: () => ({}),
            mentionPrefix: "@",
            mentions: [],
            mentionComponent: (mentionProps) => {
                return (
                    <span className={classnames("comment-mention", mentionProps.className)}>
          {mentionProps.children}
        </span>
                )
            },
        });

        this.emojiPlugin = createEmojiMartPlugin({
            data,
            set: 'facebook',
            emojiSize: 16
        });
    }



    getInitialState = () => {
        const newEditorState = EditorState.push(this.state.editorState, ContentState.createFromText(''), 'remove-range');
        return EditorState.moveFocusToEnd(newEditorState);
    }
    submit = () => {
        let {editorState, files} =  this.state;
        this.setState({loading: true, editorState: this.getInitialState(), files:[]})
        this.props.onSubmit({
            editorState,
            files
        }).then(() => {
            this.setState({loading: false})
        });
    }

    onChange = (editorState) => {


        if (this.state.showEmojiPicker) {
            this.setState({showEmojiPicker: false})
        }


        this.setState({
            editorState
        });
    };

    loadSuggestions = debounce(({value}) => {
        return this.props.api({keyword: value}).then(suggestions => this.setState({filteredSuggestions: this.filterSuggestions(suggestions)}))
    }, 500);

    onSearchChange = ({value}) => {
        this.loadSuggestions({value})
    };

    focus = () => {
        this.editor.focus();
    };

    handleKeyCommand = (command) => {
        if (command === 'chat-input-enter') {
            this.submit();
            return 'handled'
        }


        return 'not-handled'
    }
    addFiles = (file) => {


        this.setState({files: this.state.files.concat(isImageFile(file.name) ? {fileID: uuidv4(), file, type: "image"} : {
                fileID: uuidv4(),
                file,
                caption: ""
            })});
    };

    filterSuggestions = (data,) => {

        return data.map(each => ({...each, name: each.basic_info.username}));
    }

    removeFile = item => {
        let newFiles = this.state.files.filter(each => each.fileID !== item.fileID);
        this.setState({files: newFiles})
    }
    keyBindingFn = (e) => {
        if (!e.shiftKey && e.key === 'Enter') {
            return 'chat-input-enter'
        }


        return Draft.getDefaultKeyBinding(e)
    }

    render() {

        let plugins = [this.emojiPlugin];
        plugins.push(this.mentionPlugin);

        let user = userInfo.getState();
        const {MentionSuggestions} = this.mentionPlugin;
        const {Picker} = this.emojiPlugin;
        return (
            <div className={classnames("comment-input", {isReply: this.props.isReply})}>
                <CreatePostDropZone
                    onAddFiles={this.addFiles}
                />
                <div className="wrapper">
                    <div className="avatar-wrapper">
                        <Avatar
                            user={user}
                        />
                    </div>

                    <div className="input-wrapper">
                        <ClickOutside onClickOut={() => this.setState({showEmojiPicker: false})}>
                            <div>
                                <div ref={commentInput => this.commentInput = commentInput}
                                     className={classnames("comment-input")} onClick={this.focus}>
                                    <div>
                                        <Editor
                                            editorState={this.state.editorState}
                                            onChange={this.onChange}
                                            plugins={plugins}
                                            ref={(element) => {
                                                this.editor = element;
                                            }}
                                            placeholder={`Viết bình luận...`}
                                            keyBindingFn={this.keyBindingFn}

                                            handleKeyCommand={this.handleKeyCommand}

                                        />
                                        <MentionSuggestions
                                            onSearchChange={this.onSearchChange}
                                            suggestions={this.state.filteredSuggestions}
                                            // popoverComponent={<MentionPopover top={ReactDOM.findDOMNode(this.commentInput)?.offsetHeight || 0}/>}
                                            entryComponent={MentionEntry}
                                        />
                                    </div>

                                </div>
                                <div className="comment-input-actions">
                                    <div className="actions-wrapper">
                                        {transformEditorState(convertToRaw(this.state.editorState.getCurrentContent())).content && (
                                            <Tooltip
                                                text={() => "Gửi"}
                                                position={"top"}
                                            >
                                                <i className="fas fa-paper-plane send-btn" onClick={this.submit}></i>
                                            </Tooltip>
                                        )}
                                        <Tooltip
                                            position={"top"}
                                            text={() => "Chèn biểu tượng cảm xúc"}
                                        >
                                            <i className="fal fa-smile" onClick={(e) => {
                                                e.stopPropagation();
                                                this.setState({showEmojiPicker: !this.state.showEmojiPicker})
                                            }}></i>
                                        </Tooltip>
                                        <InputFileWrapper
                                            multiple={false}
                                            accept={"image/*,image/heif,image/heic,video/*"}
                                            onUploaded={this.addFiles}
                                            limitSize={10 * 1024 * 1024}
                                        >
                                            {({onClick}) => (
                                                <Tooltip
                                                    position={"top"}
                                                    text={() => "Đính kèm ảnh hoặc video"}
                                                >
                                                    <i className="fal fa-camera" onClick={onClick}></i>
                                                </Tooltip>
                                            )}
                                        </InputFileWrapper>
                                        {this.state.showEmojiPicker && (
                                            <div className={"emoji-picker"}>
                                                <Picker
                                                    perLine={7}
                                                    showPreview={false}
                                                    autoFocus={true}
                                                />
                                            </div>

                                        )}
                                    </div>
                                </div>
                            </div>
                        </ClickOutside>


                    </div>
                </div>

                {!!this.state.files.length && (
                    <div className="comment-media-wrapper">
                        {this.state.files.map(each => {
                            return (
                                <CommentMedia
                                    key={each.fileID}
                                    file={each}
                                    onRemove={() => this.removeFile(each)}
                                />
                            )
                        })}
                    </div>
                )}

            </div>
        );
    }
}

const MentionEntry = props => {

    const {
        mention,
        theme,
        searchValue,
        isFocused,
        className,
        ...parentProps
    } = props;

    return (

        <div className={classnames("comment-input-entry")} {...parentProps} >
            <div className="content-wrapper">
                <Avatar user={mention}/>
                <div className="user-info">
                    <div className="username">
                        {mention.basic_info.username}
                    </div>
                    {mention.nickname && (
                        <div className="nickname">
                            {mention.nickname}
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}