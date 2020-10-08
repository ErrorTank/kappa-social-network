import React, { Component } from "react";
import { datingApi } from "./../../../../../api/common/dating";
import { datingCardUtilities } from "./../card-container/card/datingCard";
import { datingIO } from "./../../../../../socket/sockets";
export const datingLikeUtilities = {};
export class DatingLike extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profiles: [],
    };
    datingLikeUtilities.removeLiked = (profileID) => {
      this.setState({
        profiles: this.state.profiles.filter((e) => e._id !== profileID),
      });
    };
  }
  componentDidMount() {
    this.io = datingIO.getIOInstance();
    this.io.on("be-liked", ({ profile }) => {
      this.setState({
        profiles: [profile].concat(this.state.profiles),
      });
    });
    datingApi.getLikeProfile().then((e) => {
      this.setState({
        profiles: e,
      });
    });
  }
  componentWillUnmount() {
    if (this.io) {
      this.io.off("be-liked");
    }
  }
  render() {
    const { profiles } = this.state;
    return (
      <div className="dating-matched">
        {profiles.map((people, i) => (
          <div
            className="img-matched"
            key={i}
            onClick={() =>
              datingCardUtilities.pushProfile({ ...people, isAccept: true })
            }
          >
            <img src={people.avatars[0].path} />
            <div className="username">{people.name}</div>
          </div>
        ))}
      </div>
    );
  }
}
