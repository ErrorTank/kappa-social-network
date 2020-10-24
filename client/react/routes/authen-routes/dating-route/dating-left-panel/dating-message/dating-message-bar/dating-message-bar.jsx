import React, { Component } from "react";
import { Emoji } from "emoji-mart";
import { Picker } from "emoji-mart";
import { datingProfile } from "../../../../../../../common/states/common";
import { datingIO } from "./../../../../../../../socket/sockets";
import ContentEditable from "react-contenteditable";
export class DatingMessageBar extends Component {
  constructor(props) {
    super(props);
    this.contentEditable = React.createRef();
    this.state = {
      html: "",
      showPicker: false,
    };
    this.io = datingIO.getIOInstance();
  }

  onClick = (e) => {
    let data = {
      message: this.state.html,
      user: datingProfile.getState()._id,
    };
    const { chatBoxId } = this.props;
    this.setState({
      html: "",
    });

    this.io.emit("chat-room", { data, chatBoxId });
  };
  addEmoji = (e) => {
    // console.log(e.native);
    let emoji = e.native;
    this.setState({
      html: this.state.html + emoji,
    });
  };
  render() {
    const { chatBoxId } = this.props;
    return (
      <div className='dating-message-bar'>
        <div className='dmb-input-wrapper'>
          {this.state.showPicker && (
            <span className='picker-wrapper'>
              <Picker
                onSelect={this.addEmoji}
                emojiTooltip={true}
                title='HongSonStyle'
              />
            </span>
          )}
          <ContentEditable
            className='dating-chat-input'
            html={this.state.html}
            onChange={(e) => {
              this.setState({
                html: e.target.value,
              });
            }}
            placeholder={"Nhập tin nhắn..."}></ContentEditable>
          <div
            onClick={() => {
              this.setState({
                showPicker: !this.state.showPicker,
              });
            }}
            className='dmb-emoji-picker'>
            <i className='fal fa-smile'></i>
          </div>
        </div>
        <div className='dmb-action'>
          {this.state.html.length ? (
            <div className='action-wrapper'>
              <i className='fas fa-paper-plane' onClick={this.onClick}></i>
            </div>
          ) : (
            <div className='action-wrapper'>
              <Emoji
                onClick={(emoji) => {
                  let data = {
                    message: emoji.native,
                    user: datingProfile.getState()._id,
                  };
                  console.log(data);
                  this.io.emit("chat-room", { data, chatBoxId });
                }}
                perLine={4}
                set={"facebook"}
                emoji={{ id: "+1" }}
                size={24}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}
