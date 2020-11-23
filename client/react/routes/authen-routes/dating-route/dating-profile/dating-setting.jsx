import React, { Component } from "react";
import { datingProfile } from "../../../../../common/states/common";
import { Avatar } from "./../../../../common/avatar/avatar";
import { customHistory } from "./../../../routes";
import { distanceTo } from "geolocation-utils";

export class DatingSetting extends Component {
  render() {
    return (
      <div className="dating-setting">
        <div className="dating-header">
          <i
            className="far fa-chevron-left"
            onClick={() => customHistory.push("/dating")}
          ></i>
          <div className="header-avatar">
            <Avatar
              user={{ avatar: datingProfile.getState().avatars[0].path }}
            />
          </div>
          <h2>Thông tin của tôi</h2>
        </div>
        <span className="ds-text"> Cài đặt tìm kiếm</span>
        <div className="ds-fitler">
          <div className="ds-basic">
            Thông tin cơ bản
            <div>Khoảng cách</div>
            <div>Giới tính</div>
            <div>Độ tuổi</div>
            <div>Chiều cao</div>
          </div>
          <div className="ds-education">
            Trình độ học vấn
            <div>Trình độ học vấn</div>
          </div>
          <div className>
            Lối sống
            <div>Con cái</div>
          </div>
        </div>
      </div>
    );
  }
}
