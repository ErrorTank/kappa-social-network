import React, { Component } from "react";
import classnames from "classnames";
import { datingApi } from "./../../../../../../../api/common/dating";
import { getAge } from "../../../../../../../common/utils/date-utils";
import { Tooltip } from "./../../../../../../common/tooltip/tooltip";
import { distanceTo } from "geolocation-utils";
import { datingProfile } from "../../../../../../../common/states/common";
export class MyTinderCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
    };
  }
  onSwipeLeft = () => {
    this.setState({
      current:
        this.state.current === 0
          ? this.props.info.avatars.length - 1
          : this.state.current - 1,
    });
  };
  onSwipeRight = () => {
    this.setState({
      current:
        this.state.current === this.props.info.avatars.length - 1
          ? 0
          : this.state.current + 1,
    });
  };
  onNavigate = (i) => {
    this.setState({
      current: i,
    });
  };
  render() {
    let { info } = this.props;
    let { current } = this.state;
    let avatar = info.avatars.length ? info.avatars[current].path : null;
    let userProfile = datingProfile.getState();
    let distance = distanceTo(
      {
        lat: Number(userProfile.location.lat),
        lon: Number(userProfile.location.lng),
      },
      { lat: Number(info.location.lat), lon: Number(info.location.lng) }
    );
    return (
      <div className={classnames("my-tinder-card")}>
        <div className="my-tinder-card-filter"></div>
        <img src={avatar} />
        <div className="avatar-navigator">
          {info.avatars.length > 1 &&
            info.avatars.map((e, i) => {
              return (
                <div
                  className={classnames("navigator-box", {
                    active: i === current,
                  })}
                  key={i}
                >
                  <div
                    className="card-box"
                    onClick={() => this.onNavigate(i)}
                  ></div>
                </div>
              );
            })}
        </div>
        {info.avatars.length > 1 && (
          <>
            <i
              className="fas fa-chevron-left swipe-left"
              onClick={this.onSwipeLeft}
            ></i>
            <i
              className="fas fa-chevron-right swipe-right"
              onClick={this.onSwipeRight}
            ></i>
          </>
        )}

        <div className="dating-card-info">
          <div className="dating-card-name-age">
            <div className="dating-card-name">{info.name}</div>
            <div className="dating-card-age">{getAge(info.birthday)}</div>
          </div>
          {this.state.current === 0 && (
            <div className="dating-card-bio">{info.bio}</div>
          )}
          {info.bio ? (
            this.state.current > 0 && (
              <>
                {info.university ? (
                  <div className="dating-card-info-detail">
                    <i className="fal fa-university"> </i>{" "}
                    <span>{info.university}</span>
                  </div>
                ) : (
                  info.secondarySchool && (
                    <div className="dating-card-info-detail">
                      <i className="fal fa-school"> </i>{" "}
                      <span>{info.secondarySchool}</span>
                    </div>
                  )
                )}

                <div className="dating-card-info-detail">
                  <i className="fal fa-home"> </i>{" "}
                  <span>
                    Đang sống tại{" "}
                    {info.location.ward && info.location.ward.name}{" "}
                    {info.location.district.name}, {info.location.city.name}
                  </span>
                </div>
                <div className="dating-card-info-detail">
                  <i className="fal fa-map-marker-alt"> </i>{" "}
                  <span>Cách xa {Math.ceil(distance / 1000)} kilômét</span>
                </div>
              </>
            )
          ) : (
            <>
              {info.university ? (
                <div className="dating-card-info-detail">
                  <i className="fal fa-university"></i>
                  <span>{info.university}</span>
                </div>
              ) : (
                info.secondarySchool && (
                  <div className="dating-card-info-detail">
                    <i className="fal fa-school"> </i>{" "}
                    <span>{info.secondarySchool}</span>
                  </div>
                )
              )}
              <div className="dating-card-info-detail">
                <i className="fal fa-home"></i>{" "}
                <span>
                  Đang sống tại {info.location.ward.name},{" "}
                  {info.location.district.name}, {info.location.city.name}{" "}
                </span>
              </div>
              <div className="dating-card-info-detail">
                <i className="fal fa-map-marker-alt"> </i>
                <span> Cách xa {Math.ceil(distance / 1000)} kilômét </span>
              </div>
            </>
          )}
        </div>
        <div className="dating-card-show-detail">
          <Tooltip position="top" text={() => "Mở hồ sơ"}>
            <i className="fal fa-info-circle"></i>
          </Tooltip>
        </div>
      </div>
    );
  }
}
