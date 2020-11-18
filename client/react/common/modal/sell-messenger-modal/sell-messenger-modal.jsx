import React, { Component } from 'react';
import { modals } from './../modals';
import { CommonModalLayout } from './../common-modal-layout';
export const sellMessengerModal = {
  open(config) {
    const modal = modals.openModal({
      content: (
        <SellMessengerModal {...config} onClose={(e) => modal.close(e)} />
      ),
      // disabledOverlayClose: config.disabledClose,
    });
    return modal.result;
  },
};

class SellMessengerModal extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let { onClose, profile } = this.props;
    return (
      <CommonModalLayout
        className='sell-messenger-model'
        onClose={() => {
          onClose();
        }}
        title={'Nhắn tin cho ...'}
        actions={[
          {
            className: 'btn-common-primary',
            onClick: () => {
              onClose();
            },
            content: `Trò truyện với ...`,
          },
        ]}
      >
        <div>Testing</div>
      </CommonModalLayout>
    );
  }
}
