import React, { Component } from "react";
import { Avatar } from "../../../../common/avatar/avatar";

export class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar:
        "https://scontent.fhan3-3.fna.fbcdn.net/v/t1.0-9/117085631_1990361811097488_8297188913974114068_o.jpg?_nc_cat=101&_nc_sid=09cbfe&_nc_ohc=XSSxG6TU6QEAX-l1Kyx&_nc_ht=scontent.fhan3-3.fna&oh=2877fdcba60525f68ad45f29ed4a595f&oe=5F82EA12",
    };
  }
  render() {
    const { avatar } = this.state;
    return (
      <div className="dating-header">
        <div className="header-avatar">
          <Avatar user={{ avatar: avatar }} />
        </div>
        <h2>Thông tin của tôi</h2>
      </div>
    );
  }
}
