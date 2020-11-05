import React, { Component } from "react";
import { PageTitle } from "./../../../common/page-title/page-title";
import { DatingLeftPanel } from "./dating-left-panel/dating-left-panel";
import { CardContainer } from "./card-container/card-container";

export default class DatingRoute extends Component {
  render() {
    const { loading } = this.props;
    return (
      <PageTitle title={"Hẹn hò"}>
        <div className="dating-route">
          <DatingLeftPanel />
          <div className="right-panel">
            <CardContainer />
          </div>
        </div>
      </PageTitle>
    );
  }
}
