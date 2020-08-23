import React, { Component } from 'react';
import { userInfo } from '../../../../../../../common/states/common';
import { ListingInfo } from './listing-info/listing-info';
import { Avatar } from './../../../../../../common/avatar/avatar';
import { omit } from 'lodash';
import classnames from 'classnames';

export class CreateListingInputWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canCreate: false,
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
    if (this.state.canCreate) {
      console.log(omit(state));
    }
  };

  checkRequiredfield = () => {
    const { state } = this.props;
    const { canCreate } = this.state;
    let checkBool = true;

    let requiredInput = this.requireField[state.type];
    requiredInput.forEach((e) => {
      if (state[e] !== '' && checkBool == true) {
        checkBool = false;
      }
    });
    this.setState({ canCreate: checkBool });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.state !== this.props.state) {
      this.checkRequiredfield();
    }
  }

  render() {
    let user = userInfo.getState();
    console.log(this.props.state);
    // console.log(this.state);
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
            className={classnames('cl-button', {
              disabled: !this.state.canCreate,
            })}
            onClick={() => this.setNewListing()}
          >
            Tiếp
          </div>
        </div>
      </div>
    );
  }
}
