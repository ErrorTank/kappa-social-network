import React, { Component } from "react";
import { datingProfile } from "../../../../../common/states/common";
import { PageTitle } from "../../../../common/page-title/page-title";
import { DatingCardProfile } from "./dating-card-profile";
import { DatingSetting } from "./dating-setting";

export class DatingProfile extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}
  render() {
    return (
      <PageTitle title={"Thông tin của tôi"}>
        <div className="dating-profile">
          <DatingSetting />
          <div className="right-panel">
            <DatingCardProfile />
          </div>
        </div>
      </PageTitle>
    );
  }
}
