import React, {Component} from 'react';
import Editor, {createEditorStateWithText} from 'draft-js-plugins-editor';
import createEmojiMartPlugin from 'draft-js-emoji-mart-plugin';
import createMentionPlugin from 'draft-js-mention-plugin';
import classnames from "classnames"
import Draft, {convertToRaw, EditorState, ContentState} from 'draft-js';
import data from 'emoji-mart/data/facebook.json';

import 'emoji-mart/css/emoji-mart.css'
import {ClickOutside} from "../../../../../../common/click-outside/click-outside";
import {chatApi} from "../../../../../../../api/common/chat-api";
import {Avatar} from "../../../../../../common/avatar/avatar";
import pick from "lodash/pick"
import {transformEditorState} from "../../../../../../../common/utils/editor-utils";
import {messengerIO} from "../../../../../../../socket/sockets";
import {userInfo} from "../../../../../../../common/states/common";
import isNil from "lodash/isNil"
import {Tooltip} from "../../../../../../common/tooltip/tooltip";
import {Emoji} from "emoji-mart";
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";




export class ChatInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: createEditorStateWithText(""),
            showEmojiPicker: false,
            suggestions: [],
            loadSuggestion: true,
            filteredSuggestions: [],
            isTyping: false
        }

        this.io = messengerIO.getIOInstance();
        this.emojiPlugin = createEmojiMartPlugin({
            data,
            set: 'facebook',
            emojiSize: 16
        });



        this.mentionPlugin = createMentionPlugin({
            entityMutability: 'IMMUTABLE',
            supportWhitespace: true,
            positionSuggestions: () => ({}),
            mentionPrefix: "@",
            mentions: [],
            mentionComponent: (mentionProps) => {
                return (
                    <span className={classnames("chat-input-mention", mentionProps.className)}>
          {mentionProps.children}
        </span>
                )
            },
        });
    }

    onChange = (editorState) => {
        let value = transformEditorState(convertToRaw(editorState.getCurrentContent())).content;

        let nextState = {
            editorState
        };
        if (this.state.showEmojiPicker) {
            nextState.showEmojiPicker = false;
        }
        if (!this.state.isTyping && value) {
            nextState.isTyping = true;
        }
        if (this.state.isTyping && !value) {
            nextState.isTyping = false;
        }

        if (!isNil(nextState.isTyping)) {
            this.emitTypingStatus(nextState.isTyping)
        }

        this.setState(nextState);
    };

    focus = () => {
        this.editor.focus();
    };

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.chatRoomID && nextProps.chatRoomID !== this.props.chatRoomID) {
            this.loadSuggestion(nextProps.chatRoomID);
        }


    }

    loadSuggestion = (chatRoomID) => {

        chatApi.getMentionsByKeyword(chatRoomID, "")
            .then((suggestions) => {
                this.setState({
                    suggestions,
                    loadSuggestion: false
                });
            })
    }

    onSearchChange = ({value}) => {
        this.setState({filteredSuggestions: this.filterSuggestions(this.state.suggestions, value)});
    }


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

    keyBindingFn = (e) => {
        if (!e.shiftKey && e.key === 'Enter') {
            return 'chat-input-enter'
        }


        return Draft.getDefaultKeyBinding(e)
    }

    getInputRawContent = () => {
        return transformEditorState(convertToRaw(this.state.editorState.getCurrentContent())).content;
    }

    getInitialState = () => {
        const newEditorState = EditorState.push(this.state.editorState, ContentState.createFromText(''), 'remove-range');
        return EditorState.moveFocusToEnd(newEditorState);
    }

    submitContent = () => {
        let {editorState} = this.state;
        // console.log(convertToRaw(editorState.getCurrentContent()))
        let transformedState = transformEditorState(convertToRaw(editorState.getCurrentContent()));
        if (transformedState.content || this.props.haveFiles) {

            this.props.onSubmit(transformedState);

            this.emitTypingStatus(false);
            this.setState({isTyping: false})

            this.setState({editorState: this.getInitialState()});
        }
    }

    handleKeyCommand = (command) => {
        if (command === 'chat-input-enter') {
            this.submitContent();
            return 'handled'
        }


        return 'not-handled'
    }

    emitTypingStatus = isTyping => {

        this.io.emit(`typing-${isTyping ? "start" : "done"}`, {
            chatRoomID: this.props.chatRoomID,
            user: pick(userInfo.getState(), ["_id", "basic_info", "avatar"])
        })
    };

    render() {
        const {MentionSuggestions} = this.mentionPlugin;

        let plugins = [this.emojiPlugin];
        if (this.props.canMention) {
            plugins.push(this.mentionPlugin);
        }
        const {Picker} = this.emojiPlugin;

        return (
            <>
                <div className="chat-input-wrapper">
                    <ClickOutside onClickOut={() => this.setState({showEmojiPicker: false})}>
                        <div>
                            <div className="chat-input">
                                <div>
                                    <Editor
                                        editorState={this.state.editorState}
                                        onChange={this.onChange}
                                        plugins={plugins}
                                        ref={(element) => {
                                            this.editor = element;
                                        }}
                                        onFocus={() => {
                                            this.props.onFocusEditor()
                                        }}
                                        onBlur={() => {
                                            this.setState({isTyping: false})
                                            this.emitTypingStatus(false);
                                        }}
                                        placeholder={"Nhập tin nhắn"}

                                        keyBindingFn={this.keyBindingFn}

                                        handleKeyCommand={this.handleKeyCommand}
                                    />
                                    <MentionSuggestions
                                        onSearchChange={this.onSearchChange}
                                        suggestions={this.state.filteredSuggestions}
                                        popoverComponent={<MentionPopover/>}
                                        entryComponent={MentionEntry}
                                    />
                                </div>

                                <div className={"emoji-select"} onClick={(e) => {
                                    e.stopPropagation();
                                    this.setState({showEmojiPicker: !this.state.showEmojiPicker})
                                }}>
                                    <i className="fas fa-smile"></i>
                                </div>

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

                {transformEditorState(convertToRaw(this.state.editorState.getCurrentContent())).content ? (
                    <Tooltip
                        text={() => "Gửi"}
                        position={"top"}
                    >
                        <div className='icon-wrapper react' onClick={this.submitContent}>
                            <i className="fas fa-paper-plane"></i>
                        </div>
                    </Tooltip>
                    ) :
                    this.props.defaultEmoji ? (
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

                                     this.props.onSubmit({emoji: this.props.defaultEmoji, content: "huh"})
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
                        <SkeletonTheme color={this.props.darkMode ? "#242526" : "#e3e3e3"}
                                       highlightColor={this.props.darkMode ? "#333436" : "#ebebeb"}>
                            <Skeleton count={1} height={32} width={32} duration={1}
                                      circle={true}/>

                        </SkeletonTheme>
                    )
                }
            </>

        );
    }
}


class MentionPopover extends React.Component {
    render() {

        return (
            <div className={classnames("chat-input-mention-popover")} id={this.props.id} role={"list-box"}>
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

        <div className={classnames("chat-input-entry")} {...parentProps} >
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
