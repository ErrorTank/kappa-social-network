import React, { Component } from "react";
import { datingProfile } from "../../../../../common/states/common";
import classnames from "classnames";
import { getAge } from "../../../../../common/utils/date-utils";

export class DatingCardProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
    };
  }

  onSwipeLeft = () => {
    const avatars = datingProfile.getState().avatars;
    this.setState({
      current:
        this.state.current === 0 ? avatars.length - 1 : this.state.current - 1,
    });
  };
  onSwipeRight = () => {
    const avatars = datingProfile.getState().avatars;
    this.setState({
      current:
        this.state.current === avatars.length - 1 ? 0 : this.state.current + 1,
    });
  };
  onNavigate = (i) => {
    this.setState({
      current: i,
    });
  };
  render() {
    let profile = datingProfile.getState();
    let { current } = this.state;
    let avatar = profile.avatars.length ? profile.avatars[current].path : null;
    return (
      <div className="dating-card-profile">
        <div className="dcp-top">
          <img src={avatar} />
          <div className="avatar-navigator">
            {profile.avatars.length > 1 &&
              profile.avatars.map((e, i) => {
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
          {profile.avatars.length > 1 && (
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
        </div>
        <div className="dcp-bot">
          <div className="dcpi-name-age">
            {profile.name} {","} {getAge(profile.birthday)}
          </div>
          <div className="dcp-gender">
            {profile.gender === "MALE"
              ? "Nam"
              : profile.gender === "FEMALE"
              ? "Nữ"
              : "Không xác định"}
          </div>

          <div className="dcpi-location">
            {profile.location.ward.name} {profile.location.district.name}{" "}
            {profile.location.ward.name}
          </div>
        </div>
      </div>
    );
  }
}
