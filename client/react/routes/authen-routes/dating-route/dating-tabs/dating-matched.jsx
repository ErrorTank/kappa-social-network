import React, { Component } from "react";
import { datingApi } from "./../../../../../api/common/dating";
import { datingIO } from "./../../../../../socket/sockets";
import uniqBy from "lodash/uniqBy";

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
        profiles: uniqBy([profile].concat(this.state.profiles), "_id"),
      });
    });
    datingApi.getMatchProfile().then((e) => {
      this.setState({
        profiles: uniqBy(this.state.profiles.concat(e), "_id"),
      });
    });
  }
  componentWillUnmount() {
    if (this.io) {
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
