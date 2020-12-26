import React, { Component } from "react";
import { datingProfile } from "../../../../common/states/common";
import { getAge } from "../../../../common/utils/date-utils";
import { distanceTo } from "geolocation-utils";
import classnames from "classnames";
import { datingApi } from "./../../../../api/common/dating";
export class DatingDelMatched extends Component {
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
          ? this.props.data.avatars.length - 1
          : this.state.current - 1,
    });
  };
  onSwipeRight = () => {
    this.setState({
      current:
        this.state.current === this.props.data.avatars.length - 1
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
    let { data } = this.props;
    let { current } = this.state;
    let avatar = data.avatars.length ? data.avatars[current].path : null;
    let userProfile = datingProfile.getState();
    let distance = distanceTo(
      {
        lat: Number(userProfile.location.lat),
        lon: Number(userProfile.location.lng),
      },
      { lat: Number(data.location.lat), lon: Number(data.location.lng) }
    );
    return (
      <div className="dating-card-profile">
        <div className="dcp-top">
          <img src={avatar} />
          <div className="avatar-navigator">
            {data.avatars.length > 1 &&
              data.avatars.map((e, i) => {
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
          {data.avatars.length > 1 && (
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
            {data.name}
            {","} {getAge(data.birthday)}
          </div>
          <div className="dcp-gender">
            {data.gender === "MALE"
              ? "Nam"
              : data.gender === "FEMALE"
              ? "Nữ"
              : "Không xác định"}
          </div>
          <div>
            {data.bio && (
              <>
                <i className="fas fa-book-reader"></i> {data.bio}
              </>
            )}
          </div>
          <div className="dcp-location">
            <i className="fas fa-map-marker-alt"></i>
            Đang ở {data.location.ward && `${data.location.ward.name}, `}
            {data.location.district && `${data.location.district.name}, `}
            {data.location.city && data.location.city.name}
          </div>
          <div className="dating-card-info-detail">
            <i className="fal fa-map-marker-alt"> </i>{" "}
            <span>Cách xa {Math.ceil(distance / 1000)} kilômét</span>
          </div>
          <div>
            {data.target && data.target !== "PREFER NOT TO SAY" && (
              <>
                <i className="fad fa-heart"></i>
                Đang tìm{" "}
                {data.target === "CHATTING"
                  ? "Người trò chuyện"
                  : data.target === "FRIENDSHIP"
                  ? "Tình bạn"
                  : data.target === "SOMETHING CASUAL"
                  ? "Kiểu hẹn hò không ràng buộc"
                  : data.target === "LONG-TERM RELATIONSHIP"
                  ? "Mối quan hệ lâu dài"
                  : null}
              </>
            )}
          </div>
          <div>
            {data.height && (
              <>
                <i className="fas fa-male"></i> {data.height} cm{" "}
              </>
            )}
          </div>
          <div>
            {data.job && (
              <>
                <i className="fas fa-briefcase"></i> {data.job}
              </>
            )}
          </div>
          <div>
            <i className="fas fa-graduation-cap"></i>
            {data.universityPostgraduate
              ? data.universityPostgraduate
              : data.university
              ? data.university
              : data.secondarySchool
              ? data.secondarySchool
              : "Không muốn tiết lộ"}
          </div>
          <div>
            <i className="fas fa-graduation-cap"></i>
            {data.educationLevel === "A-LEVELS,HIGHERS OR EQUIVALENT"
              ? "Bằng trung học"
              : data.educationLevel === "BACHELORS DEGREE"
              ? "Bằng đại học"
              : data.educationLevel === "UNIVERSITY(POSTGRADUATE) DEGREE"
              ? "Bằng cao học"
              : "Không muốn tiết lộ"}
          </div>
          <div>
            {data.homeTown && (
              <>
                <i className="fas fa-home-lg"></i>
                Quê Quán {data.homeTown.ward && `${data.homeTown.ward.name}, `}
                {data.homeTown.district && `${data.homeTown.district.name}, `}
                {data.homeTown.city && `${data.homeTown.city.name}`}
              </>
            )}
          </div>
          <div>
            <i className="fas fa-user-friends"></i>
            {data.yourKids === "I DON'T HAVE KIDS"
              ? "Chưa có con"
              : data.yourKids === "I HAVE KIDS"
              ? "Đã có con"
              : "Không muốn tiết lộ"}
          </div>
          <div>
            <i className="far fa-smoking"></i>
            {data.smoking === "NEVER"
              ? "Không bao giờ"
              : data.smoking === "OCCASIONALLY"
              ? "Thỉnh thoảng"
              : data.smoking === "OFTEN"
              ? " Thường xuyên"
              : "Không muốn tiết lộ"}
          </div>
          <div>
            <i className="fad fa-glass-martini-alt"></i>
            {data.drinking === "NEVER"
              ? "Không bao giờ"
              : data.drinking === "OCCASIONALLY"
              ? "Thỉnh thoảng"
              : data.drinking === "OFTEN"
              ? " Thường xuyên"
              : "Không muốn tiết lộ"}
          </div>
          <div>
            <i className="fas fa-praying-hands"></i>
            {data.religion === "PREFER NOT TO SAY"
              ? "Không muốn tiết lộ"
              : data.religion === "AGNOSTIC"
              ? "Người theo thuyết bất khả trị"
              : data.religion === "ATHEIST"
              ? "Người vô thần"
              : data.religion === "BUDDHIST"
              ? "Phật giáo"
              : data.religion === "CATHOLIC"
              ? "Công giáo"
              : data.religion === "CHRISTIAN"
              ? "Kito giáo"
              : data.religion === "HINDU"
              ? "Hindu giáo"
              : data.religion === "JEWISH"
              ? "Do thái"
              : data.religion === "MUSLIM"
              ? "Hồi giáo"
              : data.religion === "SIKH"
              ? "Sikh giáo"
              : data.religion === "SPIRITUAL"
              ? "Tâm linh"
              : "Khác"}
          </div>
          <div className="action">
            <span
              className="dcpf-button"
              onClick={() => {
                datingApi
                  .deleteMatchedProfile(userProfile._id, data._id)
                  .then(() => {
                    datingApi.deleteChatBox(userProfile._id, data._id);
                    this.props.onClick();
                  });
              }}
            >
              Hủy tương hợp
            </span>
            <span className="dcpf-button" onClick={this.props.onClick}>
              Trở về
            </span>
          </div>
        </div>
      </div>
    );
  }
}
