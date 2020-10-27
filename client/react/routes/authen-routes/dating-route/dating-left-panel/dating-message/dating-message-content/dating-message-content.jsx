import React, { Component } from "react";
import { datingApi } from "../../../../../../../api/common/dating";
import { datingIO } from "./../../../../../../../socket/sockets";
import { LoadingInline } from "./../../../../../../common/loading-inline/loading-inline";
import { reverseArr } from "../../../../../../../common/utils/array-utils";
import { InfiniteScrollWrapper } from "./../../../../../../common/infinite-scroll-wrapper/infinite-scroll-wrapper";
import classnames from "classnames";
import { datingProfile } from "../../../../../../../common/states/common";
import ReactDOM from "react-dom";
export class DatingMessageContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      loading: true,
    };
    this.io = datingIO.getIOInstance();
    this.io.on("coming-message", (message) => {
      this.setState(
        {
          messages: [message].concat(this.state.messages),
        },
        () => {
          let elem = ReactDOM.findDOMNode(this);

          elem.scrollTop = elem.scrollHeight;
        }
      );
    });
  }
  componentDidMount() {
    const { chatBoxId } = this.props;
    this.fetchMessages(chatBoxId).then(() => {
      let elem = ReactDOM.findDOMNode(this);

      elem.scrollTop = elem.scrollHeight;
    });
  }
  fetchMessages = (chatBoxId) => {
    return new Promise((res) => {
      datingApi
        .getMessages(chatBoxId, this.state.messages.length)
        .then((data) => {
          this.setState(
            {
              messages: this.state.messages.concat(data),
              loading: false,
            },
            () => {
              this.props.myRef(ReactDOM.findDOMNode(this));
              res();
            }
          );
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
        onScrollTop={() => {
          this.fetchMessages(this.props.chatBoxId);
        }}
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
