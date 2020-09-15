import React, { Component } from "react";
import { PageTitle } from "./../../../common/page-title/page-title";
import { datingApi } from "../../../../api/common/dating";
import { userInfo, datingProfile } from "./../../../../common/states/common";
import { DatingRegister } from "./datingRegister/datingRegister";
import { LoadingInline } from "./../../../common/loading-inline/loading-inline";
import { CardContainer } from "./card-container/card-container";
import { Header } from "./header/header";

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
            <div className="dating-home">
              <div className="left-panel">
                <Header />
                <div className="dating-home-tab">
                  <div className="tab-button">Kết đôi</div>
                  <div className="tab-button">Đã thích bạn</div>
                  <div className="tab-button">Tin nhắn</div>
                </div>
              </div>
              <div className="right-panel">
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
