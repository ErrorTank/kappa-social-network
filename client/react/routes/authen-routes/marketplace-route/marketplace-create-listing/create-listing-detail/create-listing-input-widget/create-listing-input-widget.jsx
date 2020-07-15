import React, { Component } from 'react';
import { userInfo } from '../../../../../../../common/states/common';
import { ListingInfo } from './listing-info/listing-info';

export class CreateListingInputWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  createInfo = [
    {
      name: 'item',
      pictureLimit: 10,
      title: 'Mặt hàng',
    },
    {
      name: 'vehicle',
      pictureLimit: 20,
      title: 'Xe',
    },
    {
      name: 'house',
      pictureLimit: 50,
      title: 'Nhà',
    },
  ];
  componentDidMount = () => {
    let { state, updateValue } = this.props;

    this.createInfo.forEach((each) => {
      if (each.name === this.props.match.params.categoryName) {
        this.setState({ title: each.title });
        updateValue('type', each.name);
        updateValue('pictureLimit', each.pictureLimit);
      }
    });
  };
  render() {
    let user = userInfo.getState();

    // console.log(this.props);
    return (
      <div className='create-listing-input-widget'>
        <div className='cs-input-header'>
          <div className='header-info'>
            <p className='fake-breadcrumb'>Marketplace</p>
            <h1 className='header-title'>{this.state.title} cần bán</h1>
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

          <ListingInfo {...this.props} />
        </div>
        <div className='cs-input-footer'></div>
      </div>
    );
  }
}
