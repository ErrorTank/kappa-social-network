import React, { Component } from "react";
import { datingApi } from "./../../../../../api/common/dating";

export class DatingMatched extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profiles: [],
    };
  }
  componentDidMount() {
    datingApi.getMatchProfile().then((e) => {
      this.setState({
        profiles: e,
      });
    });
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
