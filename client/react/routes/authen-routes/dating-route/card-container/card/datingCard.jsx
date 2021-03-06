import React, { Component } from "react";
import TinderCard from "react-tinder-card";
import { MyTinderCard } from "./myTinderCard/myTinderCard";
import reverse from "lodash/reverse";
import { datingApi } from "./../../../../../../api/common/dating";
import { DatingCardActions } from "./../action/action";
import ReactDOM from "react-dom";
import classnames from "classnames";
import { datingLikeUtilities } from "./../../dating-tabs/dating-like";
import { datingTabPanelUtilities } from "../../dating-tab-panel";
import { MyDetailTinderCard } from "./myTinderCard/myDetailTinderCard";
export const datingCardUtilities = {};
export class DatingCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profiles: [],
      openDetail: false,
    };
    this.canClick = true;
    this.timeout = null;
    datingCardUtilities.pushProfile = (profile) => {
      this.setState({
        profiles: this.state.profiles
          .filter((e) => e._id !== profile._id)
          .concat(profile),
      });
    };
  }
  openDetail = () => {
    this.setState({
      openDetail: !this.state.openDetail,
    });
  };
  componentDidMount() {
    datingApi.getInitCardProfileInfo().then((e) =>
      this.setState({
        profiles: e,
      })
    );
  }
  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  deteleCard = (seen, direction) => {
    let newProfiles = this.state.profiles.filter((e) => e._id !== seen._id);
    this.setState({
      profiles: newProfiles,
    });
    datingApi
      .getCardProfileInfo({
        exclude: newProfiles.map((each) => each._id),
        action: direction === "left" ? "DISLIKE" : "LIKE",
        seenID: seen._id,
      })
      .then((e) => {
        datingLikeUtilities.removeLiked?.(seen._id);
        if (seen.isAccept) {
          datingTabPanelUtilities.setTab("MATCHES");
        }
        this.setState({
          profiles: e.concat(this.state.profiles),
        });
      });
  };

  dislike = (profile) => {
    let datingCardElem = $(ReactDOM.findDOMNode(this.datingCard));

    $(datingCardElem.find(".my-active-tinder-card"))
      .addClass("animate-swipe-left")
      .delay(600)
      .queue((next) => {
        this.deteleCard(profile, "left");
        next();
      });
  };

  like = (profile) => {
    let datingCardElem = $(ReactDOM.findDOMNode(this.datingCard));
    $(datingCardElem.find(".my-active-tinder-card"))
      .addClass("animate-swipe-right")
      .delay(600)
      .queue((next) => {
        this.deteleCard(profile, "right");
        next();
      });
  };
  checkClick = (fn, profile) => {
    if (this.canClick) {
      this.canClick = false;
      this.timeout = setTimeout(() => {
        this.canClick = true;
        clearTimeout(this.timeout);
      }, 500);
      fn(profile);
    }
  };
  render() {
    let { profiles } = this.state;
    return (
      <>
        <div
          className="dating-card"
          ref={(datingCard) => (this.datingCard = datingCard)}
        >
          {!!profiles.length && (
            <>
              {profiles.map((each, i) => (
                <TinderCard
                  className={classnames("swipe", {
                    "my-active-tinder-card": i === profiles.length - 1,
                  })}
                  key={each._id}
                  preventSwipe={["up", "down"]}
                  onCardLeftScreen={(direction) =>
                    this.deteleCard(
                      each,

                      direction
                    )
                  }
                >
                  {this.state.openDetail === false ? (
                    <MyTinderCard info={each} openDetail={this.openDetail} />
                  ) : (
                    <MyDetailTinderCard
                      info={each}
                      openDetail={this.openDetail}
                    />
                  )}
                </TinderCard>
              ))}
            </>
          )}
        </div>
        <DatingCardActions
          onDislike={() =>
            this.checkClick(this.dislike, profiles[profiles.length - 1])
          }
          onLike={() =>
            this.checkClick(this.like, profiles[profiles.length - 1])
          }
        />
      </>
    );
  }
}
