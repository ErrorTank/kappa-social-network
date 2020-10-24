import React, { Component } from "react";
import { datingApi } from "../../../../../../../api/common/dating";
import { datingIO } from "./../../../../../../../socket/sockets";
import { LoadingInline } from "./../../../../../../common/loading-inline/loading-inline";
import { reverseArr } from "../../../../../../../common/utils/array-utils";
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
    return loading ? (
      <div className='dating-message-loading'>
        <LoadingInline />
      </div>
    ) : (
      <div className='dating-message-content'>
        {reverseArr(messages).map((each) => {
          return (
            <div key={each._id}>
              {each.user.name} : {each.message}
            </div>
          );
        })}
      </div>
    );
  }
}
