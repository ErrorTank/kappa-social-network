import React, { Component } from "react";
import { PageTitle } from "./../../../../common/page-title/page-title";
import Header from "./header/header";
import { DatingRegisterForm } from "./dating-register-form/dating-register-form";

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
          <Header />
          <DatingRegisterForm onCreateProfile={onCreateProfile} />
        </div>
      </PageTitle>
    );
  }
}
