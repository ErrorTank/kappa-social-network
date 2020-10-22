import React, { Component } from "react";
import { datingProfile } from "../../../../../common/states/common";
import { Avatar } from "../../../../common/avatar/avatar";

export class Header extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="dating-header">
        <div className="header-avatar">
          <Avatar user={{ avatar: datingProfile.getState().avatars[0].path }} />
        </div>
        <h2>Thông tin của tôi</h2>
      </div>
    );
  }
}
