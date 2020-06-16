import React, {Component} from 'react';
import Editor, {createEditorStateWithText} from 'draft-js-plugins-editor';
import createEmojiMartPlugin from 'draft-js-emoji-mart-plugin';
import createMentionPlugin from 'draft-js-mention-plugin';
import classnames from "classnames"

import data from 'emoji-mart/data/apple.json';

import 'emoji-mart/css/emoji-mart.css'
import {ClickOutside} from "../../../../../../common/click-outside/click-outside";
import {chatApi} from "../../../../../../../api/common/chat-api";
import {Avatar} from "../../../../../../common/avatar/avatar";
import debounce from "lodash/debounce"
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
            suggestions: []
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

    onSearchChange = debounce(({ value }) => {
        console.log(value)
        this.setState({
            loadSuggestion: true
        })
        chatApi.getMentionsByKeyword(this.props.chatRoomID, value)
            .then((suggestions) => {
                this.setState({
                    suggestions,
                    loadSuggestion: false
                });
            })

    }, 500);

    render() {
        const { MentionSuggestions } = this.mentionPlugin;
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
                              />
                              <MentionSuggestions
                                  onSearchChange={this.onSearchChange}
                                  suggestions={this.state.suggestions}
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
