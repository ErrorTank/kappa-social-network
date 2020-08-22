import React, { Component } from 'react';
import { userInfo } from '../../../../../../../common/states/common';
import { ListingInfo } from './listing-info/listing-info';
import { Avatar } from './../../../../../../common/avatar/avatar';
import { omit } from 'lodash';

export class CreateListingInputWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canCreate: true,
    };
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
      name: 'home',
      pictureLimit: 50,
      title: 'Nhà',
    },
  ];
  requireField = {
    item: ['files', 'title', 'price', 'category', 'location', 'availability'],
    vehicle: ['files', 'vehicleType', 'year', 'make', 'model', 'price'],
    home: [
      'files',
      'homeFor',
      'homeType',
      'numberOfBedrooms',
      'numberOfBathrooms',
      'address',
      'decription',
    ],
  };
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
  setNewListing = () => {
    const { state } = this.props;
    console.log(omit(state));
  };
  checkRequiredfield = () => {
    const { state } = this.props;
    const { canCreate } = this.state;
    if (state.type === 'item') {
      let requiredInput = this.requireField['item'];
      requiredInput.forEach((e) => {
        if (state[e] !== null) {
          return false;
          this.setState({ canCreate: false });
        }
      });
      // return true;
    }
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
              <Avatar user={user} />
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

        <div className='cs-input-footer'>
          <div
            className='cl-button'
            onClick={() => this.setNewListing()}
            disabled={this.checkRequiredfield()}
          >
            Tiếp
          </div>
        </div>
      </div>
    );
  }
}
