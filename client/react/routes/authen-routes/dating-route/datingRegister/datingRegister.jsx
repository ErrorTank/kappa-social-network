import React, { Component } from "react";
import { PageTitle } from "./../../../../common/page-title/page-title";
import { DatingRegisterForm } from "./dating-register-form/dating-register-form";
import { DatingRegisterFormHeader } from "./dating-register-form-header/dating-register-form-header";
import { datingProfile } from "../../../../../common/states/common";
import { datingUtilities } from "./../dating-layout";
export default class DatingRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  createProfile = (profile) => {
    datingUtilities.connectDatingSocket(profile._id);
    return datingProfile.setState(profile);
  };

  componentDidMount() {}

  render() {
    return (
      <PageTitle title={"Đăng ký hẹn hò"}>
        <div className="dating-register">
          <DatingRegisterFormHeader />
          <DatingRegisterForm onCreateProfile={this.createProfile} />
        </div>
      </PageTitle>
    );
  }
}
