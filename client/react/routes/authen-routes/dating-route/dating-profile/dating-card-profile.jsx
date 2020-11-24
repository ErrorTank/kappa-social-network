import React, { Component } from "react";
import { datingProfile } from "../../../../../common/states/common";
import classnames from "classnames";
import { getAge } from "../../../../../common/utils/date-utils";
import { VoiceCallWidget } from "./../../../../common/media-modal/voice-call-modal/voice-call-modal";

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
    const { handleEdit } = this.props;
    let avatar = profile.avatars.length ? profile.avatars[current].path : null;
    console.log(profile);
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
          <div className="dcp-name-age">
            {profile.name}
            {","} {getAge(profile.birthday)}
            <div className="dcp-button" onClick={handleEdit}>
              {" "}
              Sửa thông tin{" "}
            </div>
          </div>
          <div className="dcp-gender">
            {profile.gender === "MALE"
              ? "Nam"
              : profile.gender === "FEMALE"
              ? "Nữ"
              : "Không xác định"}
          </div>
          <div>
            {profile.bio && (
              <>
                <i className="fas fa-book-reader"></i> {profile.bio}
              </>
            )}
          </div>
          <div className="dcp-location">
            <i className="fas fa-map-marker-alt"></i>
            Đang ở {profile.location.ward && `${profile.location.ward.name}, `}
            {profile.location.district && `${profile.location.district.name}, `}
            {profile.location.city && profile.location.city.name}
          </div>
          <div>
            {profile.target && profile.target !== "PREFER NOT TO SAY" && (
              <>
                <i class="fad fa-heart"></i>
                Đang tìm{" "}
                {profile.target === "CHATTING"
                  ? "Người trò chuyện"
                  : profile.target === "FRIENDSHIP"
                  ? "Tình bạn"
                  : profile.target === "SOMETHING CASUAL"
                  ? "Kiểu hẹn hò không ràng buộc"
                  : profile.target === "LONG-TERM RELATIONSHIP"
                  ? "Mối quan hệ lâu dài"
                  : null}
              </>
            )}
          </div>
          <div>
            {profile.height && (
              <>
                <i className="fas fa-male"></i> {profile.height} cm{" "}
              </>
            )}
          </div>
          <div>
            {profile.job && (
              <>
                <i className="fas fa-briefcase"></i> {profile.job}
              </>
            )}
          </div>
          <div>
            <i className="fas fa-graduation-cap"></i>
            {profile.universityPostgraduate
              ? profile.universityPostgraduate
              : profile.university
              ? profile.university
              : profile.secondarySchool
              ? profile.secondaryschool
              : "Không muốn tiết lộ"}
          </div>
          <div>
            <i className="fas fa-graduation-cap"></i>
            {profile.educationLevel === "A-LEVELS,HIGHERS OR EQUIVALENT"
              ? "Bằng trung học"
              : profile.educationLevel === "BACHELORS DEGREE"
              ? "Bằng đại học"
              : profile.educationLevel === "UNIVERSITY(POSTGRADUATE) DEGREE"
              ? "Bằng cao học"
              : "Không muốn tiết lộ"}
          </div>
          <div>
            <i className="fas fa-home-lg"></i>
            Quê Quán{" "}
            {profile.homeTown.ward && `${profile.homeTown.ward.name}, `}
            {profile.homeTown.district && `${profile.homeTown.district.name}, `}
            {profile.homeTown.city && `${profile.homeTown.city.name}`}
          </div>
          <div>
            <i className="fas fa-user-friends"></i>
            {profile.yourKids === "I DON'T HAVE KIDS"
              ? "Chưa có con"
              : profile.yourKids === "I HAVE KIDS"
              ? "Đã có con"
              : "Không muốn tiết lộ"}
          </div>
          <div>
            <i className="far fa-smoking"></i>
            {profile.smoking === "NEVER"
              ? "Không bao giờ"
              : profile.smoking === "OCCASIONALLY"
              ? "Thỉnh thoảng"
              : profile.smoking === "OFTEN"
              ? " Thường xuyên"
              : "Không muốn tiết lộ"}
          </div>
          <div>
            <i className="fad fa-glass-martini-alt"></i>
            {profile.drinking === "NEVER"
              ? "Không bao giờ"
              : profile.drinking === "OCCASIONALLY"
              ? "Thỉnh thoảng"
              : profile.drinking === "OFTEN"
              ? " Thường xuyên"
              : "Không muốn tiết lộ"}
          </div>
          <div>
            <i className="fas fa-praying-hands"></i>
            {profile.religion === "PREFER NOT TO SAY"
              ? "Không muốn tiết lộ"
              : profile.religion === "AGNOSTIC"
              ? "Người theo thuyết bất khả trị"
              : profile.religion === "ATHEIST"
              ? "Người vô thần"
              : profile.religion === "BUDDHIST"
              ? "Phật giáo"
              : profile.religion === "CATHOLIC"
              ? "Công giáo"
              : profile.religion === "CHRISTIAN"
              ? "Kito giáo"
              : profile.religion === "HINDU"
              ? "Hindu giáo"
              : profile.religion === "JEWISH"
              ? "Do thái"
              : profile.religion === "MUSLIM"
              ? "Hồi giáo"
              : profile.religion === "SIKH"
              ? "Sikh giáo"
              : profile.religion === "SPIRITUAL"
              ? "Tâm linh"
              : "Khác"}
          </div>
        </div>
      </div>
    );
  }
}
