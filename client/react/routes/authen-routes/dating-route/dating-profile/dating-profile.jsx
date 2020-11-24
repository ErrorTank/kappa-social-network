import React, { Component } from "react";
import { datingProfile } from "../../../../../common/states/common";
import { PageTitle } from "../../../../common/page-title/page-title";
import { DatingCardProfile } from "./dating-card-profile";
import { DatingCardProfileFix } from "./dating-card-profile-fix";
import { DatingSetting } from "./dating-setting";

export class DatingProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ifEdit: false,
    };
  }
  handleEdit = () => {
    this.setState({ ifEdit: !this.state.ifEdit });
  };
  componentDidMount() {}
  render() {
    return (
      <PageTitle title={"Thông tin của tôi"}>
        <div className="dating-profile">
          <DatingSetting />
          <div className="right-panel">
            {this.state.ifEdit === false ? (
              <DatingCardProfile handleEdit={this.handleEdit} />
            ) : (
              <DatingCardProfileFix handleEdit={this.handleEdit} />
            )}
          </div>
        </div>
      </PageTitle>
    );
  }
}
