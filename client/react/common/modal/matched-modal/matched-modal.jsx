import React, { Component } from "react";
import { CommonModalLayout } from "../common-modal-layout";
import { modals } from "./../modals";

export const matchedModal = {
  open(config) {
    const modal = modals.openModal({
      content: <MatchedModal {...config} onClose={(r) => modal.close(r)} />,
      disabledOverlayClose: config.disabledClose,
    });
    return modal.result;
  },
};

class MatchedModal extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let { onClose, profile, userProfile } = this.props;
    console.log(userProfile);
    return (
      <div>
        <CommonModalLayout
          className="matched-model"
          onClose={() => {
            onClose();
          }}
          title={"It's a Match!"}
          actions={[
            {
              className: "btn-common-primary",
              onClick: () => {
                onClose();
              },
              content: `Trò truyện với ${profile.name}`,
            },
          ]}
        >
          <div className="mm-wrapper">
            {/* <div className="mm-img">
              <img src={profile.avatars[0].path}></img>
              <img src={userProfile.avatars[0].path} />
            </div> */}
            <div className="mm-content">
              Bạn và {profile.name} đã kết đôi thành công
            </div>
          </div>
        </CommonModalLayout>
      </div>
    );
  }
}
