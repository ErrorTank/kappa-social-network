import React, { Component } from 'react';
import { userInfo } from '../../../../../../../common/states/common';
import { ListingInfo } from './listing-info/listing-info';
import { Avatar } from './../../../../../../common/avatar/avatar';
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
import ReactDOM from 'react-dom';
import { isEmpty } from 'lodash/isEmpty';
import { customHistory } from '../../../../../routes';

export class CreateListingInputWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canCreate: false,
      error: {},
    };
  }

  // default value
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
    vehicle: ['category', 'year', 'make', 'model', 'price'],
    home: [
      'category',
      'homeType',
      'numberOfBedrooms',
      'numberOfBathrooms',
      'address',
      'decription',
    ],
  };

  componentDidUpdate(prevProps) {
    if (prevProps.state !== this.props.state) {
      this.checkRequiredfield();
    }
    if (
      prevProps.match.params.categoryName !==
      this.props.match.params.categoryName
    ) {
      this.setDefaultValue();
    }
  }

  componentDidMount = () => {
    this.forceUpdate();
    this.setDefaultValue();
  };

  setDefaultValue = () => {
    let { state, updateValue, setValues } = this.props;
    this.createInfo.forEach((each) => {
      if (each.name === this.props.match.params.categoryName) {
        this.setState({ title: each.title });
        setValues({ type: each.name, pictureLimit: each.pictureLimit });

        const setField = {
          item: itemField,
          vehicle: vehicleField,
          home: homeField,
        };
        let inputField = setField[each.name];

        inputField.map((e) => {
          if (e.default) {
            updateValue(`${e.englishName}`, e.default);
          } else if (each.options) {
            updateValue(`${e.englishName}`, null);
          } else {
            updateValue(`${e.englishName}`, '');
          }
        });
      }
      if (each.name === state.type) {
        this.setState({ title: each.title });
        setValues({ pictureLimit: each.pictureLimit });
      }
    });
  };
  //upload file
  uploadSingleFile = (file) => {
    return postApi
      .preUploadMedia({ file: file.file }, 'file')
      .then((fileData) => ({
        ...fileData,
      }));
  };

  // error function
  setError = (name, error) => {
    this.setState((prevState) => ({
      error: {
        ...prevState.error,
        [name]: { type: error.type, message: error.message },
      },
    }));
  };

  resetErrorStorage = (name = null) => {
    if (name) {
      this.setState({ error: {} });
    }
  };

  // check canCreate, true then filter result then call create api, false then set error on required input
  setNewListing = () => {
    const { state, updateValue, setValues } = this.props;
    const { files, type } = state;
    const { canCreate, error } = this.state;
    if (canCreate) {
      let newListing = cleanBlankProp(state);

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
            delete newListing[ele];
            break;
        }
      }
      Promise.all(files.map((each) => this.uploadSingleFile(each))).then(
        (newFiles) => {
          let user = userInfo.getState();
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
              customHistory.push('/marketplace/you/selling');
            });
          });
        }
      );
    } else {
      let requiredInput = this.setRequiredInput();
      const setField = {
        item: itemField,
        vehicle: vehicleField,
        home: homeField,
      };

      if (!files.length) {
        let modifyError = {
          type: 'required',
          message: 'Vui lòng tải lên ít nhất 1 ảnh.',
        };

        this.setError('files', modifyError);
      }

      let inputNeeded = setField[type].filter((e) =>
        requiredInput.includes(e.englishName)
      );

      inputNeeded.forEach((e) => {
        let value = state[e.englishName];
        if (
          e.error['required'] &&
          (!value || (value.includes('&nbsp;') && value.length === 7))
        ) {
          let modifyError = { type: 'required', message: e.error['required'] };
          this.setError(e.englishName, modifyError);
        }
      });
      this.displayFirstError();
    }
  };

  displayFirstError = () => {
    let selectInputElem = ReactDOM.findDOMNode(this).querySelector(
      '.cs-input-body'
    );
    let firstErrorIndex = Object.keys(this.state.error)[0];
    let selectedTarget = selectInputElem.querySelector(`#${firstErrorIndex}`);
    if (selectedTarget) selectInputElem.scrollTop = selectedTarget.offsetTop;
  };

  // set needed field
  setRequiredInput = () => {
    const { state } = this.props;
    const { type } = state;
    let requiredInput = this.requireField[type];

    if (state.type === 'vehicle') {
      if (state.vehicleType === 'Xe hơi/Xe tải') {
        requiredInput = [...requiredInput, 'bodyType', 'milage'];
      }
      if (state.vehicleType === 'Xe máy') {
        requiredInput = [...requiredInput, 'milage'];
      }
    }
    return requiredInput;
  };

  // check needed field
  checkRequiredfield = () => {
    const { state } = this.props;
    const { type, files } = state;
    const { canCreate } = this.state;
    let checkBool = true;
    let requiredInput = this.setRequiredInput();

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

  render() {
    let user = userInfo.getState();
    // console.log(this.state.error);
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

          <ListingInfo
            {...this.props}
            setError={this.setError}
            error={this.state.error}
            resetError={this.resetErrorStorage}
          />
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
