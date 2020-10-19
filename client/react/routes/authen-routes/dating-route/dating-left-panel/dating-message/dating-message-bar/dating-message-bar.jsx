import React, { Component } from "react";
import { Emoji } from "emoji-mart";
import { Picker } from "emoji-mart";
import { datingProfile } from "../../../../../../../common/states/common";

export class DatingMessageBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      showPicker: false,
    };
    this.io = datingIO.getIOInstance();
  }
  onClick = (e) => {
    //   s
  };
  addEmoji = (e) => {
    // console.log(e.native);
    let emoji = e.native;
    this.setState({
      text: this.state.text + emoji,
    });
  };
  render() {
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
          <input
            type="text"
            value={this.state.text}
            onChange={(e) => {
              this.setState({
                text: e.target.value,
              });
            }}
            placeholder="Nhập tin nhắn..."
          ></input>
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
          {this.state.text.length ? (
            <div className="action-wrapper">
              <i className="fas fa-paper-plane"></i>
            </div>
          ) : (
            <div className="action-wrapper">
              <Emoji
                perLine={4}
                set={"facebook"}
                emoji={{ id: "santa" }}
                size={24}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}
