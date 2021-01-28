import React, { Component } from "react";
import { PageTitle } from "../../../common/page-title/page-title";
import { datingApi } from "../../../../api/common/dating";
import { userInfo, datingProfile } from "../../../../common/states/common";
import { DatingRegister } from "./datingRegister/datingRegister";
import { LoadingInline } from "../../../common/loading-inline/loading-inline";
import { CardContainer } from "./card-container/card-container";
import { datingIO } from "../../../../socket/sockets";
import { authenCache } from "../../../../common/cache/authen-cache";
import { matchedModal } from "../../../common/modal/matched-modal/matched-modal";
import { DatingLeftPanel } from "./dating-left-panel/dating-left-panel";
import { beLikedModal } from "../../../common/modal/be-liked-modal/be-liked-modal";
import { customHistory } from "./../../routes";
import { datingSocketUtilities } from "./dating-layout";
export const datingUtilities = {};
export class DatingLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      hasProfile: false,
    };
    datingUtilities.connectDatingSocket = this.connectDatingSocket;
  }
  connectDatingSocket = (id) => {
    datingIO.connect({ token: authenCache.getAuthen() }).then((IO) => {
      IO.emit("join-own-room", { profileID: id }, () => {
        this.io = datingIO.getIOInstance();
        this.io.on("matched-modal", ({ profile }) => {
          matchedModal.open({ profile });
        });
        this.io.on("be-liked-modal", ({ profile }) => {
          beLikedModal.open({ profile });
        });
      });
    });
  };
  componentWillUnmount() {
    datingIO.disconnect();
    if (this.io) {
      this.io.off("matched-modal");
    }
    if (this.io) {
      this.io.off("be-liked-modal");
    }
  }
  componentDidMount() {
    datingApi
      .getUserProfile()
      .then((profile) => {
        if (profile) {
          this.connectDatingSocket(profile._id);
          console.log(profile);
          return datingProfile.setState(profile).then(() => true);
        }
        return null;
      })
      .then((r) => {
        this.setState({
          loading: false,
        });
      });
  }
  render() {
    let { loading, hasProfile } = this.state;
    return (
      <div className="dating-layout">
        {!loading &&
          this.props.children({
            loading,
          })}
      </div>
    );
  }
}
