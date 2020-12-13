import React, { Component } from 'react';
import { listingApi } from '../../../../api/common/listing-api';
import { numberToMoney } from '../../../../common/utils/listing-utils';
import { CommonModalLayout } from '../common-modal-layout';
import { modals } from '../modals';

export const deleteListingModal = {
  open(config) {
    const modal = modals.openModal({
      content: (
        <DeleteListingModal {...config} onClose={(r) => modal.close(r)} />
      ),
      disabledOverlayClose: config.disabledClose,
    });
    return modal.result;
  },
};

class DeleteListingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // loading: true,
    };
    // listingApi.getListingByListingID(this.props.id).then(e => this.setState({listing}));
  }
  render() {
    let { onClose, listing, handleGetListing, forceUpdate } = this.props;
    let { title, price, make, model, year, homeType, files } = listing;
    console.log(listing);
    return (
      <CommonModalLayout
        className='delete-listing-modal'
        onClose={() => {
          onClose();
        }}
        title={'Bạn muốn xóa sản phẩm này?'}
        actions={[
          {
            className: 'btn-common-primary',
            onClick: () => {
              onClose();
            },
            content: (
              <div className='delete-listing-wrapper'>
                <div
                  className='delete-listing-btn'
                  onClick={() => {
                    listingApi.deleteListing(listing._id);
                    setTimeout(() => {
                      handleGetListing();
                      forceUpdate();
                    }, 100);
                  }}
                >
                  Xóa
                </div>
              </div>
            ),
          },
        ]}
      >
        <div className='delete-question'>
          Bạn có chắc chắn bạn muốn xóa sản phẩm này?
        </div>

        <div className='delete-listing-info'>
          <div className='sl-picture'>
            <img src={files[0].path} alt='' />
          </div>
          <div className='sl-basic-info'>
            <div className='sl-title'>
              {title
                ? title
                : make || year || model
                ? `${make} ${model} ${year}`
                : homeType}
            </div>
            <div className='sl-price'>{numberToMoney(price.toString())}</div>
          </div>
        </div>
      </CommonModalLayout>
    );
  }
}
