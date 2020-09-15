import React, { Component } from "react";
import { PageTitle } from "./../../../../common/page-title/page-title";
import { DatingRegisterForm } from "./dating-register-form/dating-register-form";
import { DatingRegisterFormHeader } from "./dating-register-form-header/dating-register-form-header";

export class DatingRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    let { onCreateProfile } = this.props;
    return (
      <PageTitle title={"Đăng ký hẹn hò"}>
        <div className="dating-register">
          <DatingRegisterFormHeader />
          <DatingRegisterForm onCreateProfile={onCreateProfile} />
        </div>
      </PageTitle>
    );
  }
}
