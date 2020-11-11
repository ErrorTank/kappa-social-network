import React, { Component } from "react";
import { datingProfile } from "../../../../../common/states/common";
import { Avatar } from "./../../../../common/avatar/avatar";
import { customHistory } from "./../../../routes";

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
      </div>
    );
  }
}
