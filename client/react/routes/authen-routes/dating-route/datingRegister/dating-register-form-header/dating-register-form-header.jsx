import React, { Component } from "react";
import { userInfo } from "../../../../../../common/states/common";

export class DatingRegisterFormHeader extends Component {
  constructor() {
    super();
  }
  render() {
    let user = userInfo.getState();

    return (
      <div className="dating-register-form-header">
        <h1>
          Chào mừng bạn, <span>{user.basic_info.username} !</span>
        </h1>
        <h2>Bắt đầu tạo hồ sơ hẹn hò cho mình thôi...</h2>
        <p>
          Mọi thay đổi của bạn ở đây đều không ảnh hưởng đến nội dung hiển thị
          trên trang cá nhân của bạn
        </p>
      </div>
    );
  }
}
