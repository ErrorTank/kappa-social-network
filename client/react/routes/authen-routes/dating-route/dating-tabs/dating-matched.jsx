import React, { Component } from "react";
import { datingApi } from "./../../../../../api/common/dating";
import { datingIO } from "./../../../../../socket/sockets";

export class DatingMatched extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profiles: [],
    };
  }
  componentDidMount() {
    this.io = datingIO.getIOInstance();
    this.io.on("matched", ({ profile }) => {
      this.setState({
        profiles: [profile].concat(this.state.profiles),
      });
    });
    datingApi.getMatchProfile().then((e) => {
      this.setState({
        profiles: e,
      });
    });
  }
  componentWillUnmount() {
    if (this.io) {
      console.log(1);
      this.io.off("matched");
    }
  }
  render() {
    const { profiles } = this.state;
    return (
      <div className="dating-matched">
        {profiles.map((people, i) => (
          <div className="img-matched" key={i}>
            <img src={people.avatars[0].path} />
            <div className="username">{people.name}</div>
          </div>
        ))}
      </div>
    );
  }
}
