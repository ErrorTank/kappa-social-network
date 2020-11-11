import React, { Component } from "react";
import { Emoji } from "emoji-mart";
import { Picker } from "emoji-mart";
import { datingProfile } from "../../../../../../../common/states/common";
import { datingIO } from "./../../../../../../../socket/sockets";
import ContentEditable from "react-contenteditable";
import sanitizeHtml from "sanitize-html";
import { setEndOfContenteditable } from "../../../../../../../common/utils/string-utils";
import ReactDOM from "react-dom";

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

  sanitizeConf = {
    allowedTags: ["b", "i", "em", "strong", "a", "p", "h1", "br"],
    allowedAttributes: { a: ["href"] },
  };

  onSubmit = (e) => {
    let data = {
      message: this.state.html,
      user: datingProfile.getState()._id,
    };
    const { chatBoxId } = this.props;
    this.setState({
      html: "",
    });
    console.log("dmm2");
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
    console.log(this.state);
    const { chatBoxId } = this.props;
    return (
      <div className="dating-message-bar">
        <div className="dmb-input-wrapper">
          {this.state.showPicker && (
            <span className="picker-wrapper">
              <Picker
                onSelect={this.addEmoji}
                emojiTooltip={true}
                title="HongSonStyle"
              />
            </span>
          )}
          <ContentEditable
            innerRef={(input) => (this.input = input)}
            className="dating-chat-input"
            html={this.state.html}
            onChange={(e) => {
              this.setState({
                html: sanitizeHtml(e.target.value, this.sanitizeConf),
              });
            }}
            placeholder={"Nhập tin nhắn..."}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                e.preventDefault();
                if (e.shiftKey) {
                  this.setState({
                    html: this.state.html + "<br/>",
                  });
                } else {
                  this.onSubmit();
                }
              }
            }}
          ></ContentEditable>
          <div
            onClick={() => {
              this.setState({
                showPicker: !this.state.showPicker,
              });
            }}
            className="dmb-emoji-picker"
          >
            <i className="fal fa-smile"></i>
          </div>
        </div>
        <div className="dmb-action">
          {this.state.html.length ? (
            <div className="action-wrapper">
              <i className="fas fa-paper-plane" onClick={this.onSubmit}></i>
            </div>
          ) : (
            <div className="action-wrapper">
              <Emoji
                onClick={(emoji) => {
                  let data = {
                    message: emoji.native,
                    user: datingProfile.getState()._id,
                  };
                  this.io.emit("chat-room", { data, chatBoxId });
                  console.log("dmm1");
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
