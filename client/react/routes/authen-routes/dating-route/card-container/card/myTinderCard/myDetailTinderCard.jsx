import React, { Component } from "react";
import { distanceTo } from "geolocation-utils";
import { datingProfile } from "../../../../../../../common/states/common";
import classnames from "classnames";
import { getAge } from "../../../../../../../common/utils/date-utils";
export class MyDetailTinderCard extends Component {
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
    console.log(info);
    return (
      <div className="dating-card-profile">
        <div className="dcp-top">
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
        </div>
        <div className="dcp-bot">
          <div className="dcp-name-age">
            {info.name}
            {","} {getAge(info.birthday)}
            <div className="dcp-button" onClick={this.props.openDetail}>
              {" "}
              Trở về{" "}
            </div>
          </div>
          <div className="dcp-gender">
            {info.gender === "MALE"
              ? "Nam"
              : info.gender === "FEMALE"
              ? "Nữ"
              : "Không xác định"}
          </div>
          <div>
            {info.bio && (
              <>
                <i className="fas fa-book-reader"></i> {info.bio}
              </>
            )}
          </div>
          <div className="dcp-location">
            <i className="fas fa-map-marker-alt"></i>
            Đang ở {info.location.ward && `${info.location.ward.name}, `}
            {info.location.district && `${info.location.district.name}, `}
            {info.location.city && info.location.city.name}
          </div>
          <div className="dating-card-info-detail">
            <i className="fal fa-map-marker-alt"> </i>{" "}
            <span>Cách xa {Math.ceil(distance / 1000)} kilômét</span>
          </div>
          <div>
            {info.target && info.target !== "PREFER NOT TO SAY" && (
              <>
                <i className="fad fa-heart"></i>
                Đang tìm{" "}
                {info.target === "CHATTING"
                  ? "Người trò chuyện"
                  : info.target === "FRIENDSHIP"
                  ? "Tình bạn"
                  : info.target === "SOMETHING CASUAL"
                  ? "Kiểu hẹn hò không ràng buộc"
                  : info.target === "LONG-TERM RELATIONSHIP"
                  ? "Mối quan hệ lâu dài"
                  : null}
              </>
            )}
          </div>
          <div>
            {info.height && (
              <>
                <i className="fas fa-male"></i> {info.height} cm{" "}
              </>
            )}
          </div>
          <div>
            {info.job && (
              <>
                <i className="fas fa-briefcase"></i> {info.job}
              </>
            )}
          </div>
          <div>
            <i className="fas fa-graduation-cap"></i>
            {info.universityPostgraduate
              ? info.universityPostgraduate
              : info.university
              ? info.university
              : info.secondarySchool
              ? info.secondaryschool
              : "Không muốn tiết lộ"}
          </div>
          <div>
            <i className="fas fa-graduation-cap"></i>
            {info.educationLevel === "A-LEVELS,HIGHERS OR EQUIVALENT"
              ? "Bằng trung học"
              : info.educationLevel === "BACHELORS DEGREE"
              ? "Bằng đại học"
              : info.educationLevel === "UNIVERSITY(POSTGRADUATE) DEGREE"
              ? "Bằng cao học"
              : "Không muốn tiết lộ"}
          </div>
          <div>
            {info.homeTown && (
              <>
                <i className="fas fa-home-lg"></i>
                Quê Quán {info.homeTown.ward && `${info.homeTown.ward.name}, `}
                {info.homeTown.district && `${info.homeTown.district.name}, `}
                {info.homeTown.city && `${info.homeTown.city.name}`}
              </>
            )}
          </div>
          <div>
            <i className="fas fa-user-friends"></i>
            {info.yourKids === "I DON'T HAVE KIDS"
              ? "Chưa có con"
              : info.yourKids === "I HAVE KIDS"
              ? "Đã có con"
              : "Không muốn tiết lộ"}
          </div>
          <div>
            <i className="far fa-smoking"></i>
            {info.smoking === "NEVER"
              ? "Không bao giờ"
              : info.smoking === "OCCASIONALLY"
              ? "Thỉnh thoảng"
              : info.smoking === "OFTEN"
              ? " Thường xuyên"
              : "Không muốn tiết lộ"}
          </div>
          <div>
            <i className="fad fa-glass-martini-alt"></i>
            {info.drinking === "NEVER"
              ? "Không bao giờ"
              : info.drinking === "OCCASIONALLY"
              ? "Thỉnh thoảng"
              : info.drinking === "OFTEN"
              ? " Thường xuyên"
              : "Không muốn tiết lộ"}
          </div>
          <div>
            <i className="fas fa-praying-hands"></i>
            {info.religion === "PREFER NOT TO SAY"
              ? "Không muốn tiết lộ"
              : info.religion === "AGNOSTIC"
              ? "Người theo thuyết bất khả trị"
              : info.religion === "ATHEIST"
              ? "Người vô thần"
              : info.religion === "BUDDHIST"
              ? "Phật giáo"
              : info.religion === "CATHOLIC"
              ? "Công giáo"
              : info.religion === "CHRISTIAN"
              ? "Kito giáo"
              : info.religion === "HINDU"
              ? "Hindu giáo"
              : info.religion === "JEWISH"
              ? "Do thái"
              : info.religion === "MUSLIM"
              ? "Hồi giáo"
              : info.religion === "SIKH"
              ? "Sikh giáo"
              : info.religion === "SPIRITUAL"
              ? "Tâm linh"
              : "Khác"}
          </div>
        </div>
      </div>
    );
  }
}
