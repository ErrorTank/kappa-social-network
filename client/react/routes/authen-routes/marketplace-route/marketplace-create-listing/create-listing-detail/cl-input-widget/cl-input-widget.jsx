import React, { Component } from 'react';
import { userInfo } from '../../../../../../../common/states/common';
import { ListingInfo } from './listing-info/listing-info';
import { Avatar } from './../../../../../../common/avatar/avatar';
import { omit, flatMap } from 'lodash';
import {
  itemField,
  vehicleField,
  homeField,
} from './../../../../../../../const/listing';
import classnames from 'classnames';
import {
  cleanBlankProp,
  moneyToNumber,
} from '../../../../../../../common/utils/listing-utils';
import { listingApi } from './../../../../../../../api/common/listing-api';
import { postApi } from './../../../../../../../api/common/post-api';

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
    item: ['title', 'price', 'category', 'location', 'availability'],
    vehicle: ['vehicleType', 'year', 'make', 'model', 'price'],
    home: [
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
        let inputField;
        this.setState({ title: each.title });
        updateValue('type', each.name);
        updateValue('pictureLimit', each.pictureLimit);
        switch (each.name) {
          case 'item':
            inputField = itemField;
            break;
          case 'vehicle':
            inputField = vehicleField;
            break;
          case 'home':
            inputField = homeField;
            break;
        }
        inputField.map((e) => {
          if (e.default) {
            updateValue(`${e.englishName}`, e.default);
          } else {
            updateValue(`${e.englishName}`, '');
          }
        });
      }
    });
  };

  uploadSingleFile = (file) => {
    return postApi
      .preUploadMedia({ file: file.file }, 'file')
      .then((fileData) => ({
        ...fileData,
      }));
  };

  setNewListing = () => {
    const { state } = this.props;
    const { files, type } = state;
    // console.log(state);
    console.log(this.state.canCreate);
    if (this.state.canCreate) {
      let newListing = cleanBlankProp(state);

      if (type === 'vehicle' && state.vehicleType) {
        newListing.category = newListing.vehicleType;
      }
      if (type === 'home' && state.homeFor) {
        newListing.category = newListing.homeFor;
      }

      for (let ele in newListing) {
        if (
          typeof newListing[ele] == 'string' &&
          newListing[ele].indexOf('₫') > -1
        ) {
          newListing[ele] = moneyToNumber(newListing[ele]);
        }

        switch (ele) {
          case 'type':
          case 'pictureLimit':
          case 'vehicleType':
          case 'homeFor':
            delete newListing[ele];
            break;
        }
      }
      Promise.all(files.map((each) => this.uploadSingleFile(each))).then(
        (newFiles) => {
          let user = userInfo.getState();
          // console.log(user._id);
          let moreInfo = {
            postTime: Date.now(),
            files: newFiles,
            user: user._id,
          };
          navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            moreInfo.position = {
              lat: latitude,
              lon: longitude,
            };
            let submitListing = { ...newListing, ...moreInfo };
            listingApi.createListing(submitListing).then((e) => {
              console.log(e);
            });
          });
        }
      );
    }
  };

  checkRequiredfield = () => {
    const { state } = this.props;
    const { type, files } = state;
    const { canCreate } = this.state;
    let checkBool = true;
    let requiredInput = this.requireField[type];

    if (state.type === 'vehicle') {
      if (state.vehicleType === 'Xe hơi/Xe tải') {
        let moreRequire = ['bodyType', 'milage'];
        requiredInput = [...requiredInput, ...moreRequire];
      }
      if (state.vehicleType === 'Xe máy') {
        let moreRequire = ['milage'];
        requiredInput = [...requiredInput, ...moreRequire];
      }
    }

    if (!files.length && files.length > state.pictureLimit) {
      checkBool = false;
    }
    for (let i = 0; i < requiredInput.length; i++) {
      if (!state[requiredInput[i]]) {
        checkBool = false;
        break;
      }
    }
    canCreate !== checkBool && this.setState({ canCreate: checkBool });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.state !== this.props.state) {
      this.checkRequiredfield();
    }
  }

  render() {
    let user = userInfo.getState();
    // console.log(this.props.state);
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
