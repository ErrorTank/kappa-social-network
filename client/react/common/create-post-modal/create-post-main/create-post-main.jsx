import React, {Component} from 'react';
import {Avatar} from "../../avatar/avatar";
import {Select} from "../../select/select";
import {ClickOutside} from "../../click-outside/click-outside";
import {InputFileWrapper} from "../../file-input/file-input";
import {Tooltip} from "../../tooltip/tooltip";
import {PostPolicies} from "../create-post-modal";
import {emojiPlugin} from "../../../layout/authen-layout/create-message-widget/chat-box/message-utilities/chat-input/chat-input";
import {userInfo} from "../../../../common/states/common";
import {DropZone} from "../../file-input/dropzone";
import createMentionPlugin from "draft-js-mention-plugin";
import {isImageFile} from "../../../../common/utils/file-upload-utils";
import classnames from "classnames";
import Editor from 'draft-js-plugins-editor';
const {Picker} = emojiPlugin;
import {v4 as uuidv4} from 'uuid';
import {FilesPreview} from "../files-preview/files-preview";

const CreatePostDropZone = props => {
    const handleUploadFiles = (files) => {
        props.onAddFiles(files);
        return Promise.resolve();
    };
    return (
        <DropZone
            name="chat-box-file-upload"
            limitSize={10 * 1024 * 1024}
            className="background-dropzone"
            accept={"image/*,image/heif,image/heic,video/*"}
            multiple={true}
            dropPlaceHolder={(
                <div className="background-dropzone-placeholder">
                    <span>Thả files vào đây</span>
                </div>
            )}
            onChange={(files) => handleUploadFiles(files)}
        />
    )
}


export class CreatePostMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            suggestions: [],
            loadSuggestion: true,
            showEmojiPicker: false,
            filteredSuggestions: [],
        }
        this.mentionPlugin = createMentionPlugin({
            entityMutability: 'IMMUTABLE',
            supportWhitespace: true,
            positionSuggestions: () => ({}),
            mentionPrefix: "@",
            mentions: [],
            mentionComponent: (mentionProps) => {
                return (
                    <span className={classnames("create-post-mention", mentionProps.className)}>
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


        this.props.onChange({
            editorState
        });
    };

    onSearchChange = ({value}) => {
        this.setState({filteredSuggestions: this.filterSuggestions(this.state.suggestions, value)});
    };

    filterSuggestions = (data, keyword) => {

        return keyword ? data.map(each => {
            if ((each.basic_info.username || "").toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
                return {...each, name: each.basic_info.username}
            }
            if ((each.nickname || "").toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
                return {...each, name: each.nickname}
            }
            return each
        }).filter(each => each.name) : data.map(each => ({...each, name: each.basic_info.username}));
    }


    focus = () => {
        this.editor.focus();
    };



    tagFriends = () => {
        this.props.openTagFriendTab();
    };

    addFiles = (files) => {
        let newFiles = Array.from(files).map(file => {
            return isImageFile(file.name) ? {fileID: uuidv4(), file, type: "image"} : {
                fileID: uuidv4(),
                file,
                caption: ""
            };
        });

        this.props.onChange({files: this.props.files.concat(newFiles)});
    };

    render() {
        let plugins = [emojiPlugin];
        plugins.push(this.mentionPlugin);
        let actions = [
            {
                icon: <i className="far fa-photo-video"></i>,
                label: "Ảnh/Video",
                className: "media"
            },  {
                icon: <i className="fas fa-user-tag"></i>,
                label: "Tag bạn bè",
                onClick: this.tagFriends,
                className: "tag"

            }
        ]
        let {policy} = this.props;
        let user = userInfo.getState();
        const {MentionSuggestions} = this.mentionPlugin;
        return (
            <div className="create-post-main">
                <CreatePostDropZone
                    onAddFiles={this.addFiles}
                />
                <div className="cpm-wrapper">

                    <div className="cpm-header">
                        <div className="avatar-wrapper">
                            <Avatar
                                user={user}
                            />
                        </div>
                        <div className="right-panel">
                            <div className="username">{user.basic_info.username}</div>
                            <div className="action">
                                <Select
                                    className={"policy-picker"}
                                    options={PostPolicies}
                                    value={policy}
                                    onChange={policy => {
                                        this.props.onChange({policy});
                                    }}
                                    displayAs={value => (
                                        <div className="post-policy">
                                            <span>{value.icon}</span>
                                            <span>{value.label}</span>
                                        </div>
                                    )}
                                    isSelected={option => option.value === policy.value}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="cpm-body">
                        {!!this.props.files.length && (
                            <FilesPreview
                                files={this.props.files}
                                removeAll={() => this.props.onChange({files: []})}
                            />
                        )}
                        <div className="cpm-input-wrapper">
                            <ClickOutside onClickOut={() => this.setState({showEmojiPicker: false})}>
                                <div>
                                    <div className={classnames("cpm-input", {collapsed: this.props.files.length})} onClick={this.focus}>
                                        <div>
                                            <Editor
                                                editorState={this.props.editorState}
                                                onChange={this.onChange}
                                                plugins={plugins}
                                                ref={(element) => {
                                                    this.editor = element;
                                                }}
                                                placeholder={`Hôm nay bạn nghĩ gì, ${user.basic_info.username}?`}

                                            />
                                            <MentionSuggestions
                                                onSearchChange={this.onSearchChange}
                                                suggestions={this.state.filteredSuggestions}
                                                popoverComponent={<MentionPopover/>}
                                                entryComponent={MentionEntry}
                                            />
                                        </div>


                                    </div>
                                    <div className={"emoji-select"} onClick={(e) => {
                                        e.stopPropagation();
                                        this.setState({showEmojiPicker: !this.state.showEmojiPicker})
                                    }}>
                                        <i className="fal fa-smile"></i>
                                    </div>
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
                            </ClickOutside>
                        </div>
                        <div className="actions-bar">
                            <div className="bar-title">
                                Thêm vào bài đăng
                            </div>
                            <div className="actions">
                                {actions.map(each => each.className !== 'tag' ? (
                                    <InputFileWrapper
                                        multiple={true}
                                        accept={each.className === 'media' ? "image/*,image/heif,image/heic,video/*" : "*"}
                                        onUploaded={this.addFiles}
                                        key={each.label}
                                        limitSize={10 * 1024 * 1024}
                                    >
                                        {({onClick}) => (
                                            <Tooltip
                                                key={each.label}
                                                position={"top"}
                                                text={() => each.label}
                                            >
                                                <div className={classnames("action", each.className)} onClick={onClick}>
                                                    {each.icon}
                                                </div>
                                            </Tooltip>
                                        )}
                                    </InputFileWrapper>
                                ) : (
                                    <Tooltip
                                        key={each.label}
                                        position={"top"}
                                        text={() => each.label}
                                    >
                                        <div className={classnames("action", each.className)} onClick={each.onClick}>
                                            {each.icon}
                                        </div>
                                    </Tooltip>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
class MentionPopover extends React.Component {
    render() {

        return (
            <div className={classnames("cpm-mention-popover")} id={this.props.id} role={"list-box"}>
                {this.props.children}
            </div>
        )
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

        <div className={classnames("cpm-entry")} {...parentProps} >
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