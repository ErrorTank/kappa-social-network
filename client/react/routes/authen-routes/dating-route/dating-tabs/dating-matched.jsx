import React, { Component } from "react";
import { datingApi } from "./../../../../../api/common/dating";
import { datingIO } from "./../../../../../socket/sockets";
import uniqBy from "lodash/uniqBy";
import { datingCardUtilities } from "./../card-container/card/datingCard";
import { matchedProfile } from "../../../../../common/states/common";
import { KComponent } from "./../../../../common/k-component";

export class DatingMatched extends KComponent {
  constructor(props) {
    super(props);
    this.state = {
      // profiles: [],
    };
    this.onUnmount(
      matchedProfile.onChange((nextState, oldState) => {
        if (nextState !== oldState) {
          this.forceUpdate();
        }
      })
    );
  }
  componentDidMount() {
    this.io = datingIO.getIOInstance();
    this.io.on("matched", ({ profile }) => {
      matchedProfile.setState(
        uniqBy([profile].concat(matchedProfile.getState()), "_id")
      );
    });
    datingApi.getMatchProfile().then((e) => {
      matchedProfile.setState(
        uniqBy(matchedProfile.getState().concat(e), "_id")
      );
    });
  }
  componentWillUnmount() {
    if (this.io) {
      this.io.off("matched");
    }
  }
  render() {
    // const { profiles } = this.state;
    let profiles = matchedProfile.getState();
    console.log(profiles);
    const { onClickProfile } = this.props;
    return (
      <div className="dating-matched">
        {profiles &&
          profiles.map((people, i) => (
            <div
              className="img-matched"
              key={i}
              onClick={() => onClickProfile(people)}
            >
              <img src={people.avatars[0].path} />
              <div className="username">{people.name}</div>
            </div>
          ))}
      </div>
    );
  }
}
