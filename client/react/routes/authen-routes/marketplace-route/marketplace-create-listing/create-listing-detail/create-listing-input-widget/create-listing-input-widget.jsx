import React, { Component } from 'react';
import { userInfo } from '../../../../../../../common/states/common';
import { ListingInfo } from './listing-info/listing-info';
import { ListingInfoContext } from '../../../../../../context/listing-info-context';

export class CreateListingInputWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      limit: '',
    };
  }

  createInfo = [
    {
      name: 'item',
      limit: 10,
      title: 'Mặt hàng',
    },
    {
      name: 'vehicle',
      limit: 20,
      title: 'Xe',
    },
    {
      name: 'house',
      limit: 50,
      title: 'Nhà',
    },
  ];
  render() {
    let user = userInfo.getState();
    let info;
    return (
      <ListingInfoContext.Consumer>
        {({ updateValue, state }) => {
          let type = this.props.match.params.categoryName;
          this.createInfo.forEach((each) => {
            each.name === type && (info = each);
          });
          return (
            <div className='create-listing-input-widget'>
              <div className='cs-input-header'>
                <div className='header-info'>
                  <p className='fake-breadcrumb'>Marketplace</p>
                  <h1 className='header-title'>{info.title} cần bán</h1>
                </div>
                <div className='save-draft-button'>
                  <span className='save-draft-title'>Save Draft</span>
                </div>
              </div>

              <div className='line-seperater'></div>

              <div className='cs-input-body'>
                <div className='user-info-display'>
                  <div className='user-avatar-wrapper'>
                    <img src={user.avatar} alt='user avatar' />
                  </div>
                  <div className='user-info-wrapper'>
                    <div className='user-name'>{user.basic_info.username}</div>
                    <div className='user-marketplace-info'>
                      <span className='um-info'>Niêm yết trên Marketplace</span>
                      <span className='um-info dot'> · </span>
                      <div className='um-info icon'>
                        <i className='far fa-globe-asia'></i>
                      </div>
                      <span className='um-info'>Công khai</span>
                    </div>
                  </div>
                </div>

                <ListingInfo
                  type={type}
                  updateValue={updateValue}
                  state={state}
                  limit={info.limit}
                />
              </div>
              <div className='cs-input-footer'></div>
            </div>
          );
        }}
      </ListingInfoContext.Consumer>
    );
  }
}
