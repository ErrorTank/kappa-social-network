import React, { Component } from 'react';
import { numberToMoney } from '../../../../../../common/utils/listing-utils';
import { listingApi } from './../../../../../../api/common/listing-api';
import { Button } from './../../../../../common/button/button';
import classnames from 'classnames';
import { Dropdownable } from './../../../../../common/dropdownable/dropdownable';
import { customHistory } from './../../../../routes';

export class YourListing extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    listingApi
      .getListingByUserID(this.props.user._id)
      .then((e) => this.setState({ sellingList: e }));
  }
  additionFunction = [
    {
      icon: <i class='fas fa-list'></i>,
      label: 'Xem bài niêm yết',
      onClick: (e) => customHistory.push(`/marketplace/item/${e}`),
    },
    {
      icon: <i class='fas fa-pen'></i>,
      label: 'Chỉnh sửa bài niêm yết',
      onClick: (e) => customHistory.push(`/marketplace/edit/${e}`),
    },
    {
      icon: <i class='fas fa-trash-alt'></i>,
      label: 'Xóa bài niêm yết',
      // onClick: (e) => customHistory.push(`/marketplace/delete/${e}`),
    },
  ];
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
                          : e.model || e.year || e.model
                          ? `${e.make} ${e.model} ${e.year}`
                          : e.homeType}
                      </div>
                      <div className='sl-price'>
                        {numberToMoney(e.price.toString())}
                      </div>
                    </div>
                    <div className='sl-addition-info'>
                      Đã niêm yết trên Marketplace
                    </div>
                  </div>
                </div>
                <div className='sl-function'>
                  <Button className={classnames('facebook-button long')}>
                    <i className='fas fa-check'></i>
                    <span>Đánh dấu là còn hàng</span>
                  </Button>
                  <Button className={classnames('facebook-button long')}>
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
                        {this.additionFunction.map((each) => {
                          return (
                            <div
                              className='listing-choice'
                              onClick={() => each.onClick(e._id)}
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
