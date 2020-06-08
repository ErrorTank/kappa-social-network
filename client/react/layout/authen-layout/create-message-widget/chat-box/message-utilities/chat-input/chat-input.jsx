import React, {Component} from 'react';
import Editor, {createEditorStateWithText} from 'draft-js-plugins-editor';
import createEmojiMartPlugin from 'draft-js-emoji-mart-plugin';
import data from 'emoji-mart/data/apple.json';

import 'emoji-mart/css/emoji-mart.css'
import {ClickOutside} from "../../../../../../common/click-outside/click-outside";

const emojiPlugin = createEmojiMartPlugin({
    data,
    set: 'apple'
});


const {Picker} = emojiPlugin;
const plugins = [emojiPlugin];

export class ChatInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: createEditorStateWithText(""),
            showEmojiPicker: false
        }
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

    render() {
        console.log(this.state)
        return (

                <ClickOutside onClickOut={() => this.setState({showEmojiPicker: false})}>
                  <>
                      <div className="chat-input">
                          <div onClick={this.focus}>
                              <Editor
                                  editorState={this.state.editorState}
                                  onChange={this.onChange}
                                  plugins={plugins}
                                  ref={(element) => {
                                      this.editor = element;
                                  }}
                                  placeholder={"Nhập tin nhắn"}
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
