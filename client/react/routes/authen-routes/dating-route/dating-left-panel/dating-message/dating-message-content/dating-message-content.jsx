import React, { Component } from "react";
import { datingApi } from "../../../../../../../api/common/dating";
import { datingIO } from "./../../../../../../../socket/sockets";
import { LoadingInline } from "./../../../../../../common/loading-inline/loading-inline";
import { reverseArr } from "../../../../../../../common/utils/array-utils";
import { InfiniteScrollWrapper } from "./../../../../../../common/infinite-scroll-wrapper/infinite-scroll-wrapper";
import classnames from "classnames";
import { datingProfile } from "../../../../../../../common/states/common";
export class DatingMessageContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      loading: true,
    };
    this.io = datingIO.getIOInstance();
    this.io.on("coming-message", (message) => {
      this.setState({
        messages: [message].concat(this.state.messages),
      });
    });
  }
  componentDidMount() {
    const { chatBoxId } = this.props;
    this.fetchMessages(chatBoxId);
  }
  fetchMessages = (chatBoxId) => {
    datingApi
      .getMessages(chatBoxId, this.state.messages.length)
      .then((data) => {
        this.setState({
          messages: this.state.messages.concat(data),
          loading: false,
        });
      });
  };
  componentWillUnmount() {
    this.io.off("coming-message");
  }
  render() {
    console.log(this.state);
    let { messages, loading } = this.state;
    console.log(messages);
    return loading ? (
      <div className="dating-message-loading">
        <LoadingInline />
      </div>
    ) : (
      <InfiniteScrollWrapper
        className={"dating-message-container"}
        onScrollTop={() => {}}
        onScrollBottom={() => null}
      >
        {() => {
          return reverseArr(messages).map((each) => {
            return (
              <div
                key={each._id}
                className={classnames("dm-content-wrapper", {
                  "dm-user": each.user._id === datingProfile.getState()._id,
                })}
              >
                {each.user._id != datingProfile.getState()._id && (
                  <div className="dm-avatar">
                    <img src={each.user.avatars[0].path} />
                  </div>
                )}
                <div
                  className="dm-content"
                  dangerouslySetInnerHTML={{ __html: each.message }}
                ></div>
              </div>
            );
          });
        }}
      </InfiniteScrollWrapper>
    );
  }
}
