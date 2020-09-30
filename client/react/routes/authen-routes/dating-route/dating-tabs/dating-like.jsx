import React, { Component } from "react";
import { datingApi } from "./../../../../../api/common/dating";
import { datingCardUtilities } from "./../card-container/card/datingCard";

export class DatingLike extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profiles: [],
    };
  }
  componentDidMount() {
    datingApi.getLikeProfile().then((e) => {
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
          <div
            className="img-matched"
            key={i}
            onClick={() => datingCardUtilities.pushProfile(people)}
          >
            <img src={people.avatars[0].path} />
            <div className="username">{people.name}</div>
          </div>
        ))}
      </div>
    );
  }
}
