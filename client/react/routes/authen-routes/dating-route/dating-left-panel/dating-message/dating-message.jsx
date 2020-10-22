import React, { Component } from "react";
import { datingProfile } from "../../../../../../common/states/common";
import { Avatar } from "../../../../../common/avatar/avatar";
import { TAB_PANEL_TABS } from "../../dating-tab-panel";
import { DatingMessageBar } from "./dating-message-bar/dating-message-bar";
import { DatingMessageContent } from "./dating-message-content/dating-message-content";
import { datingApi } from "./../../../../../../api/common/dating";
import { datingIO } from "./../../../../../../socket/sockets";

export class DatingMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatBox: null,
    };
    this.io = datingIO.getIOInstance();
    datingApi
      .getBasicChatboxInfor(
        datingProfile.getState()._id,
        props.selectedProfile._id
      )
      .then((chatBox) => {
        this.io.emit("join-dating-chatbox", { chatBoxId: chatBox._id });
        this.setState({ chatBox });
      });
  }
  componentWillUnmount() {
    this.io.emit("out-dating-chatbox", { chatBoxId: this.state.chatBox._id });
  }

  render() {
    const { onSwitch, selectedProfile } = this.props;
    return (
      <div className="dating-chat-box-container">
        <div className="dating-chat-header">
          <i
            className="fal fa-long-arrow-left"
            onClick={() => onSwitch(TAB_PANEL_TABS.MESSAGE)}
          ></i>
          <div className="dating-chat-avatar">
            <div className="avatar-wrapper">
              <img src={selectedProfile.avatars[0].path} />
            </div>
          </div>
          <p>{selectedProfile.name}</p>
        </div>
        <DatingMessageContent />
        {this.state.chatBox && (
          <DatingMessageBar chatBoxId={this.state.chatBox._id} />
        )}
      </div>
    );
  }
}
