import React, {Component} from 'react';
import Editor, {createEditorStateWithText} from 'draft-js-plugins-editor';
import createEmojiMartPlugin from 'draft-js-emoji-mart-plugin';
import createMentionPlugin from 'draft-js-mention-plugin';
import classnames from "classnames"
import Draft ,{ convertToRaw  ,EditorState, ContentState} from 'draft-js';
import data from 'emoji-mart/data/apple.json';

import 'emoji-mart/css/emoji-mart.css'
import {ClickOutside} from "../../../../../../common/click-outside/click-outside";
import {chatApi} from "../../../../../../../api/common/chat-api";
import {Avatar} from "../../../../../../common/avatar/avatar";
import debounce from "lodash/debounce"
import {transformEditorState} from "../../../../../../../common/utils/editor-utils";
const emojiPlugin = createEmojiMartPlugin({
    data,
    set: 'apple'
});


const {Picker} = emojiPlugin;


export class ChatInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: createEditorStateWithText(""),
            showEmojiPicker: false,
            suggestions: [],
            loadSuggestion: true,
            filteredSuggestions: []
        }

        this.mentionPlugin = createMentionPlugin({
            entityMutability: 'IMMUTABLE',
            supportWhitespace: true,
            positionSuggestions: () =>({}),
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
        if(this.state.showEmojiPicker){
            this.setState({showEmojiPicker: false});
        }

        this.setState({
            editorState,
        });
    };

    focus = () => {
        this.editor.focus();
    };

    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.chatRoomID && nextProps.chatRoomID !== this.props.chatRoomID){
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

    filterSuggestions =  (data, keyword) => {

        return keyword ? data.map(each => {
            if((each.basic_info.username || "").toLowerCase().indexOf(keyword.toLowerCase()) > -1){
                return {...each, name: each.basic_info.username}
            }
            if((each.nickname || "").toLowerCase().indexOf(keyword.toLowerCase()) > -1){
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

    handleKeyCommand = (command) => {
        if (command === 'chat-input-enter') {
            let {editorState} = this.state;
            console.log(convertToRaw(editorState.getCurrentContent()))
            let transformedState = transformEditorState(convertToRaw(editorState.getCurrentContent()));
            if(transformedState.content){
                this.props.onSubmit(transformedState);
                this.setState({ editorState: EditorState.createWithContent(ContentState.createFromText(""))});
            }
            return 'handled'
        }


        return 'not-handled'
    }

    render() {
        const { MentionSuggestions } = this.mentionPlugin;
        console.log(this.state.filteredSuggestions)
        return (

                <ClickOutside onClickOut={() => this.setState({showEmojiPicker: false})}>
                  <>
                      <div className="chat-input">
                          <div onClick={this.focus}>
                              <Editor
                                  editorState={this.state.editorState}
                                  onChange={this.onChange}
                                  plugins={ [emojiPlugin, this.mentionPlugin]}
                                  ref={(element) => {
                                      this.editor = element;
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
                              />
                          </div>

                      )}
                      </>
                </ClickOutside>


        );
    }
}



class MentionPopover extends React.Component{
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
