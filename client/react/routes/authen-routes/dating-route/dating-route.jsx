import React, { Component } from "react";
import { PageTitle } from "./../../../common/page-title/page-title";
import { DatingLeftPanel } from "./dating-left-panel/dating-left-panel";
import { CardContainer } from "./card-container/card-container";
import { DatingDelMatched } from "./dating-del-matched";

export default class DatingRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: null,
    };
  }
  onClickProfile = (profile) => {
    this.setState({
      profile,
    });
  };
  render() {
    const { loading } = this.props;
    const { profile } = this.state;
    return (
      <PageTitle title={"Hẹn hò"}>
        <div className="dating-route">
          <DatingLeftPanel onClickProfile={this.onClickProfile} />
          <div className="right-panel">
            {profile ? (
              <DatingDelMatched
                data={profile}
                onClick={() => {
                  this.setState({ profile: null });
                }}
              />
            ) : (
              <CardContainer />
            )}
          </div>
        </div>
      </PageTitle>
    );
  }
}
