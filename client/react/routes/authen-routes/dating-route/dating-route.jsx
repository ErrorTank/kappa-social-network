import React, { Component } from "react";
import { PageTitle } from "./../../../common/page-title/page-title";
import { datingApi } from "../../../../api/common/dating";
import { userInfo, datingProfile } from "./../../../../common/states/common";
import { customHistory } from "./../../routes";
import { DatingRegister } from "./datingRegister/datingRegister";
import { LoadingInline } from "./../../../common/loading-inline/loading-inline";

export default class DatingRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: null,
      loading: true,
    };
  }

  componentDidMount() {
    datingApi.checkDatingProfile(userInfo.getState()._id).then((profile) => {
      if (profile) {
        this.setState({
          profile,
          loading: false,
        });
      } else {
        this.setState({
          profile: null,
          loading: false,
        });
      }
    });
  }

  onCreateProfile = (profile) => {
    this.setState({ profile });
  };

  render() {
    let { profile, loading } = this.state;
    return (
      <div className="dating-route">
        {loading ? (
          <LoadingInline />
        ) : profile ? (
          <PageTitle title={"Hẹn hò"}>
            <h1>Trang chu hen ho</h1>
          </PageTitle>
        ) : (
          <DatingRegister onCreateProfile={this.onCreateProfile} />
        )}
      </div>
    );
  }
}
