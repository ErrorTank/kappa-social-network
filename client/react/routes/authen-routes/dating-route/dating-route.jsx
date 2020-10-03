import React, { Component } from "react";
import { PageTitle } from "./../../../common/page-title/page-title";
import { datingApi } from "../../../../api/common/dating";
import { userInfo, datingProfile } from "./../../../../common/states/common";
import { DatingRegister } from "./datingRegister/datingRegister";
import { LoadingInline } from "./../../../common/loading-inline/loading-inline";
import { CardContainer } from "./card-container/card-container";
import { DatingLeftPanel } from "./dating-left-panel";

export default class DatingRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      hasProfile: false,
    };
  }

  componentDidMount() {
    datingApi.getUserProfile().then((profile) => {
      this.setState({
        loading: false,
      });
      if (profile) {
        this.setState({
          hasProfile: true,
        });
        datingProfile.setState(profile);
      }
    });
  }

  onCreateProfile = (profile) => {
    datingProfile.setState(profile);
  };

  render() {
    let { loading, hasProfile } = this.state;
    return (
      <div className='dating-route'>
        {loading ? (
          <LoadingInline />
        ) : hasProfile ? (
          <PageTitle title={"Hẹn hò"}>
            <div className='dating-home'>
              <DatingLeftPanel />
              <div className='right-panel'>
                <CardContainer />
              </div>
            </div>
          </PageTitle>
        ) : (
          <DatingRegister onCreateProfile={this.onCreateProfile} />
        )}
      </div>
    );
  }
}
