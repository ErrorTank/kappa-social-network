import React, { Component } from "react";
import { v4 as uuidv4 } from "uuid";
import { datingProfile, userInfo } from "../../../../../common/states/common";
import { getReceiveFromChatBox } from "../../../../../common/utils/dating-utils";
import { datingApi } from "./../../../../../api/common/dating";
export class DatingMessageTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatBoxes: [],
    };
    datingApi.getChatBoxesByProfileId(datingProfile.getState()._id).then((cb) =>
      this.setState({
        chatBoxes: cb,
      })
    );
  }
  render() {
    const { chatBoxes } = this.state;
    const { onSwitch, onClickProfile } = this.props;
    return (
      <div className="dating-message-tab">
        {chatBoxes.map((each, i) => {
          let receiver = getReceiveFromChatBox(
            each,
            datingProfile.getState()._id
          );
          return (
            <div
              className="dating-chat-box"
              key={i}
              onClick={() => {
                onSwitch(receiver), onClickProfile(receiver);
              }}
            >
              <div className="dating-chat-avatar">
                <div className="avatar-wrapper">
                  <img src={receiver.avatars[0].path} />
                </div>
              </div>
              <div className="dating-wapper-content">
                <div className="dating-chat-name">{receiver.name}</div>
                {each.lastestMessage ? (
                  <div className="dating-last-message">
                    {each.lastestMessage.user._id ===
                    datingProfile.getState()._id ? (
                      <span className="highlight dark">Bạn : </span>
                    ) : (
                      `${receiver.name} :  `
                    )}
                    <span
                      className="lastest-message"
                      dangerouslySetInnerHTML={{
                        __html: each.lastestMessage.message,
                      }}
                    ></span>
                  </div>
                ) : (
                  <span>Nhấn để bắt đầu trò chuyện</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
