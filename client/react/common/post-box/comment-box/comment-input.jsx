import React, {Component} from 'react';
import createMentionPlugin from "draft-js-mention-plugin";
import Editor, {createEditorStateWithText} from 'draft-js-plugins-editor';
import classnames from "classnames";
import debounce from "lodash/debounce";
import {isImageFile} from "../../../../common/utils/file-upload-utils";
import {v4 as uuidv4} from 'uuid';
import {emojiPlugin} from "../../../layout/authen-layout/create-message-widget/chat-box/message-utilities/chat-input/chat-input";
import {userInfo} from "../../../../common/states/common";
import {CreatePostDropZone} from "../../create-post-modal/create-post-main/create-post-main";
import {Avatar} from "../../avatar/avatar";
import {Tooltip} from "../../tooltip/tooltip";
import {ClickOutside} from "../../click-outside/click-outside";
const {Picker} = emojiPlugin;

export class CommentInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadSuggestion: true,
            showEmojiPicker: false,
            filteredSuggestions: [],
            editorState: createEditorStateWithText(""),
            files: []
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
    addFiles = (files) => {
        console.log(files)
        let newFiles = Array.from(files).map(file => {
            return isImageFile(file.name) ? {fileID: uuidv4(), file, type: "image"} : {
                fileID: uuidv4(),
                file,
                caption: ""
            };
        });

        this.setState({files: this.props.files.concat(newFiles)});
    };

    filterSuggestions = (data,) => {

        return data.map(each => ({...each, name: each.basic_info.username})) ;
    }

    render() {
        let plugins = [emojiPlugin];
        plugins.push(this.mentionPlugin);

        let user = userInfo.getState();
        const {MentionSuggestions} = this.mentionPlugin;
        return (
            <div className="comment-input">
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
                                <div ref={commentInput => this.commentInput = commentInput} className={classnames("comment-input")} onClick={this.focus}>
                                    <div>
                                        <Editor
                                            editorState={this.state.editorState}
                                            onChange={this.onChange}
                                            plugins={plugins}
                                            ref={(element) => {
                                                this.editor = element;
                                            }}
                                            placeholder={`Viết bình luận...`}

                                        />
                                        <MentionSuggestions
                                            onSearchChange={this.onSearchChange}
                                            suggestions={this.state.filteredSuggestions}
                                            // popoverComponent={<MentionPopover top={ReactDOM.findDOMNode(this.commentInput)?.offsetHeight || 0}/>}
                                            entryComponent={MentionEntry}
                                        />
                                    </div>
                                    <div className="comment-input-actions">
                                        <div className="actions-wrapper">
                                            <i className="fal fa-smile"  onClick={(e) => {
                                                e.stopPropagation();
                                                this.setState({showEmojiPicker: !this.state.showEmojiPicker})
                                            }}></i>

                                            <i className="fal fa-camera"></i>
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
                            </div>
                        </ClickOutside>



                    </div>
                </div>
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