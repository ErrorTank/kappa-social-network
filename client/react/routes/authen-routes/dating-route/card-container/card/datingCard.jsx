import React, { Component } from "react";
import TinderCard from "react-tinder-card";
import { MyTinderCard } from "./myTinderCard/myTinderCard";
import reverse from "lodash/reverse";
import { datingApi } from "./../../../../../../api/common/dating";

export class DatingCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profiles: [],
    };
  }
  componentDidMount() {
    datingApi.getInitCardProfileInfo().then((e) =>
      this.setState({
        profiles: e,
      })
    );
  }
  getNewCard = (people, direction) => {
    datingApi
      .getCardProfileInfo({
        seenID: people._id,
        action: direction === "left" ? "DISLIKE" : "LIKE",
      })
      .then((e) => {
        this.setState({
          profiles: this.state.profiles.concat(e),
        });
      });
  };
  deteleCard = (people) => {
    this.setState({
      profiles: this.state.profiles.filter((e) => e._id !== people._id),
    });
  };
  render() {
    let { profiles } = this.state;
    console.log(profiles);
    return (
      <div className="dating-card">
        {profiles.length && (
          <>
            {profiles[1] && (
              <TinderCard
                className="swipe"
                preventSwipe={["up", "down"]}
                onSwipe={(direction) => this.getNewCard(profiles[1], direction)}
                onCardLeftScreen={() => this.deteleCard(profiles[1])}
              >
                <MyTinderCard info={profiles[1]} />
              </TinderCard>
            )}
            {profiles[0] && (
              <TinderCard
                className="swipe"
                preventSwipe={["up", "down"]}
                onSwipe={(direction) => this.getNewCard(profiles[0], direction)}
                onCardLeftScreen={() => this.deteleCard(profiles[0])}
              >
                <MyTinderCard info={profiles[0]} />
              </TinderCard>
            )}
          </>
        )}
      </div>
    );
  }
}
