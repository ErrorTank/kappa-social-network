import React, { Component } from "react";
import { datingIO } from "./../../../../../../../socket/sockets";

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
        messages: this.state.messages.concat(message),
      });
    });
  }
  componentWillUnmount() {
    this.io.off("coming-message");
  }
  render() {
    let { messages } = this.state;
    return (
      <div className="dating-message-content">
        {messages.map((each) => {
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
