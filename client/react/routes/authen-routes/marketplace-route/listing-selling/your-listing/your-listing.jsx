import React, { Component } from 'react';
import { listingApi } from './../../../../../../api/common/listing-api';
import { Button } from './../../../../../common/button/button';
import classnames from 'classnames';
import { Dropdownable } from './../../../../../common/dropdownable/dropdownable';
import { customHistory } from './../../../../routes';
import { deleteListingModal } from './../../../../../common/modal/delete-listing-modal/delete-listing-modal';
import { numberToMoney } from '../../../../../../common/utils/listing-utils';
import moment from 'moment';
import { createPostModal } from './../../../../../common/create-post-modal/create-post-modal';

export class YourListing extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleGetListing();
  }
  handleGetListing = () => {
    listingApi
      .getListingByUserID(this.props.user._id)
      .then((e) => this.setState({ sellingList: e }));
  };
  handleUpdateStock = (listing) => {
    listingApi
      .updateStock(
        listing.isStocked ? { off: true } : { on: true },
        listing._id
      )
      .then((e) => {
        // console.log(e);
        this.handleGetListing();
      });
  };
  additionFunction = [
    {
      icon: <i className='fas fa-list'></i>,
      label: 'Xem bài niêm yết',
      onClick: (e) => customHistory.push(`/marketplace/listing/${e._id}`),
    },
    {
      icon: <i className='fas fa-pen'></i>,
      label: 'Chỉnh sửa bài niêm yết',
      onClick: (e) => customHistory.push(`/marketplace/edit/${e._id}`),
    },
    {
      icon: <i className='fas fa-trash-alt'></i>,
      label: 'Xóa bài niêm yết',
      onClick: (e) => this.handleDeleteListing(e),
    },
  ];
  handleDeleteListing = (listing) => {
    deleteListingModal.open({
      listing,
      handleGetListing: () => this.handleGetListing(),
      forceUpdate: () => this.forceUpdate(),
    });
  };
  render() {
    const { sellingList } = this.state;
    // console.log(sellingList);
    return (
      <div className='your-listing'>
        <div className='sold-listing-wrapper'>
          <div className='sold-listing-header'>
            <span>Đã bán</span>
          </div>
          {sellingList &&
            sellingList.map((e) => (
              <div className='sold-listing' key={e._id}>
                <div className='sl-info'>
                  <div className='sl-picture'>
                    <img src={e.files[0].path} alt='' />
                  </div>
                  <div className='sl-display-info'>
                    <div className='sl-basic-info'>
                      <div className='sl-title'>
                        {e.title
                          ? e.title
                          : e.make || e.year || e.model
                          ? `${e.make} ${e.model} ${e.year}`
                          : e.homeType}
                      </div>
                      <div className='sl-price'>
                        {numberToMoney(e.price.toString())}
                      </div>
                      <div className='sl-more-info'>
                        <span
                          className={classnames('stock-wrapper', {
                            runout: !e.isStocked,
                          })}
                        >
                          {!e.isStocked ? 'Hết hàng' : 'Còn hàng'}
                        </span>

                        {` ·  Đăng lúc ${moment(e.postTime).format('DD/MM')}`}
                      </div>
                    </div>
                    <div className='sl-addition-info'>
                      Đã niêm yết trên Marketplace
                    </div>
                  </div>
                </div>
                <div className='sl-function'>
                  <Button
                    className={classnames('facebook-button long active')}
                    onClick={() => {
                      this.handleUpdateStock(e);
                    }}
                  >
                    <i className='fas fa-check'></i>
                    <span>
                      Đánh dấu là {e.isStocked ? 'hết hàng' : 'còn hàng'}
                    </span>
                  </Button>
                  <Button
                    className={classnames('facebook-button long')}
                    onClick={() => {
                      createPostModal.open({
                        placeholder: `Bình luận của bạn?`,
                        shareMarketplace: true,
                        listing: e,
                      });
                    }}
                  >
                    <i className='fas fa-share'></i>
                    <span>Chia sẻ</span>
                  </Button>

                  <Dropdownable
                    className={'listing-actions'}
                    toggle={() => (
                      <div className='listing-actions-toggle'>
                        <Button className={classnames('facebook-button')}>
                          <i className='fal fa-ellipsis-h'></i>
                        </Button>
                      </div>
                    )}
                    content={() => (
                      <div className='listing-action-choice'>
                        {this.additionFunction.map((each, i) => {
                          return (
                            <div
                              className='listing-choice'
                              onClick={() => each.onClick(e)}
                              key={i}
                            >
                              <div className='lc-icon'>{each.icon}</div>
                              <div className='lc-label'>{each.label}</div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }
}
