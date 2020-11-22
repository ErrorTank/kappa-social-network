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
            Đang ở {profile.location.ward && profile.location.ward.name}{" "}
            {profile.location.district && profile.location.district.name}{" "}
            {profile.location.city && profile.location.city.name}
          </div>
          <div>
            {profile.bio
              ? profile.bio
              : "Hãy mô tả bản thân bằng một vài từ hoặc câu ..."}
          </div>
          <div>
            {profile.height ? `${profile.height} cm` : "Thêm chiều cao"}
          </div>
          <div>{profile.job ? profile.job : "Thêm việc làm"}</div>
          <div>
            {profile.universityPostgraduate
              ? profile.universityPostgraduate
              : profile.university
              ? profile.university
              : profile.secondarySchool
              ? profile.secondaryschool
              : "Thêm trường học"}
          </div>
          <div>
            {profile.educationLevel === "A-LEVELS,HIGHERS OR EQUIVALENT"
              ? "Bằng trung học"
              : profile.educationLevel === "BACHELORS DEGREE"
              ? "Bằng đại học"
              : profile.educationLevel === "UNIVERSITY(POSTGRADUATE) DEGREE"
              ? "Bằng cao học"
              : "Không muốn tiết lộ"}
          </div>
          <div>
            Quê Quán {profile.homeTown.ward && profile.homeTown.ward.name}{" "}
            {profile.homeTown.district && profile.homeTown.district.name}{" "}
            {profile.homeTown.city && profile.homeTown.city.name}
          </div>
          <div>
            {profile.yourKids === "I DON'T HAVE KIDS"
              ? "Chưa có con"
              : profile.yourKids === "I HAVE KIDS"
              ? "Đã có con"
              : "Không muốn tiết lộ"}
          </div>
          <div>
            {profile.smoking === "NEVER"
              ? "Không bao giờ"
              : profile.smoking === "OCCASIONALLY"
              ? "Thỉnh thoảng"
              : profile.smoking === "OFTEN"
              ? " Thường xuyên"
              : "Không muốn tiết lộ"}
          </div>
          <div></div>
        </div>
      </div>
    );
  }
}
