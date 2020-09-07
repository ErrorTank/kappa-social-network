import React, { Component } from 'react';
import { ListingInfoInput } from '../../../../../../../common/listing-info-input/listing-info-input';
import {
  fieldByCategory,
  itemField,
  vehicleField,
  fieldByVehicleType,
  homeField,
  fieldByHomeFor,
} from '../../../../../../../../const/listing';
import { customHistory } from '../../../../../../routes';
import { ListingInfoSelect } from '../../../../../../../common/listing-info-select/listing-info-select';
import { v4 as uuidv4 } from 'uuid';
import { omit, pick } from 'lodash';
// import * as yup from 'yup';
import { InputFileWrapper } from './../../../../../../../common/file-input/file-input';
import { FileDisplay } from './../../../../../../../layout/authen-layout/create-message-widget/chat-box/message-utilities/file-display/file-display';
import { addressApi } from './../../../../../../../../api/common/address-api';
import classnames from 'classnames';
import {
  checkNumber,
  moneyToNumber,
  handleCheckError,
} from '../../../../../../../../common/utils/listing-utils';

export class ListingInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dependedInput: '',
      inputField: '',
      error: {
        title: '',
        price: '',
      },
    };

    //get option for location
    addressApi.getAddress({}).then((city) => {
      // console.log(city);
      let locationOption = city.map((e) => {
        return pick(e, ['name']);
      });
      itemField.filter((e) => {
        if (e.englishName === 'location') {
          return (e.options = locationOption);
        } else {
          return e;
        }
      });
      vehicleField.filter((e) => {
        if (e.englishName === 'location') {
          return (e.options = locationOption);
        } else {
          return e;
        }
      });
    });
  }
  // display function
  handleInputDisplay = () => {
    const { state, updateValue } = this.props;
    let {
      pictureLimit,
      type,
      category,
      vehicleType,
      homeFor,
      ...other
    } = state;
    switch (type) {
      case 'item':
        this.setState({ inputField: itemField });
        break;
      case 'vehicle':
        this.setState({ inputField: vehicleField });
        break;
      case 'home':
        this.setState({ inputField: homeField });
        break;
    }
  };

  handleSetDependent = (obj, dependent) => {
    const { state, updateValue } = this.props;
    let { pictureLimit, type, ...other } = state;
    for (let i = 0; i < obj.length; i++) {
      if (obj[i].name === dependent) {
        let result = omit(obj[i], ['_id', 'name']);
        this.setState({ dependedInput: result });
      }
    }
  };

  //check display change
  componentDidUpdate(prevProps) {
    let oldState = prevProps.state;
    let newState = this.props.state;
    if (
      prevProps.match.params.categoryName !==
      this.props.match.params.categoryName
    ) {
      this.props.updateValue('type', this.props.match.params.categoryName);
    }
    if (oldState.type !== newState.type) {
      this.handleInputDisplay();
    }
    if (oldState.category !== newState.category) {
      this.handleSetDependent(fieldByCategory, newState.category);
    }
    if (oldState.vehicleType !== newState.vehicleType) {
      this.handleSetDependent(fieldByVehicleType, newState.vehicleType);
    }
    if (oldState.homeFor !== newState.homeFor) {
      this.handleSetDependent(fieldByHomeFor, newState.homeFor);
    }
  }

  // change number->money display
  handlePriceDisplay = (name, value) => {
    let newValue = moneyToNumber(value);

    if (newValue.includes('&nbsp;')) {
      newValue = newValue.slice(0, newValue.length - 7);
      if (newValue === '') {
        this.props.updateValue([name], '');
      }
    }

    if (checkNumber(newValue)) {
      if (newValue.length > 10) {
        this.props.updateValue([name], '');
      } else {
        let money = newValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        this.props.updateValue([name], `${money} ₫`);
      }
    }
  };
  // hover function
  mouse = (name) => {
    switch (name) {
      case 'title':
      case 'make':
      case 'year':
      case 'model':
      case 'homeType':
        this.props.updateValue('hoverArr', 'title');
        break;
      case 'price':
      case 'pricePerMonth':
        this.props.updateValue('hoverArr', 'price');
        break;
      case 'size':
      case 'condition':
      case 'brand':
      case 'platform':
      case 'carrie':
      case 'deviceName':
      case 'material':
        this.props.updateValue('hoverArr', 'category');
        break;
      case 'decription':
        this.props.updateValue('hoverArr', 'decription');
        break;
      case 'location':
        this.props.updateValue('hoverArr', 'location');
        break;
      case 'image':
        this.props.updateValue('hoverArr', 'image');
        break;
    }
  };
  mouseOut = () => {
    this.props.updateValue('hoverArr', '');
  };

  //file( image in this case ) function
  addFiles = (files) => {
    let newFiles = Array.from(files).map((file) => {
      return { fileID: uuidv4(), file, type: 'image' };
    });
    this.props.updateValue('files', this.props.state.files.concat(newFiles));
  };
  removeFile = (fileID) => {
    this.props.updateValue(
      'files',
      this.props.state.files.filter((file) => file.fileID !== fileID)
    );
  };
  render() {
    const { state, updateValue } = this.props;
    let { pictureLimit, type, category, files, ...other } = state;
    const { inputField, error, dependedInput } = this.state;

    // console.log(state);
    return (
      <div className='listing-info'>
        <div className='picture-input'>
          <div className='picture-input-header'>
            <span
              className={classnames('picture-limit', {
                error: files.length > pictureLimit,
              })}
            >
              Ảnh
              <span className='dot'> · </span>
              {files.length || 0} / {type && <span>{pictureLimit}</span>}
            </span>
            <span className='sub'>
              {' '}
              - Bạn có thể thêm tối đa {pictureLimit} ảnh
            </span>
          </div>
          {!!files.length ? (
            <div
              className='images-display'
              onMouseEnter={() => this.mouse('image')}
              onMouseLeave={() => this.mouseOut()}
            >
              <div className='images-container'>
                {files.map((file) => (
                  <FileDisplay
                    key={file.fileID}
                    file={file}
                    onClose={() => this.removeFile(file.fileID)}
                  />
                ))}
                {!!files.length && (
                  <InputFileWrapper
                    multiple={true}
                    accept={'image/*,image/heif,image/heic'}
                    onUploaded={this.addFiles}
                    limitSize={10 * 1024 * 1024}
                  >
                    {({ onClick }) => (
                      <div className='add-file-wrapper'>
                        {files.length < pictureLimit && (
                          <div className='add-file' onClick={onClick}>
                            <i className='fas fa-file-plus'></i>
                            <span>Thêm ảnh</span>
                          </div>
                        )}
                      </div>
                    )}
                  </InputFileWrapper>
                )}
              </div>
            </div>
          ) : (
            <InputFileWrapper
              multiple={true}
              accept={'image/*,image/heif,image/heic'}
              onUploaded={this.addFiles}
              limitSize={10 * 1024 * 1024}
            >
              {({ onClick }) => (
                <div
                  className='add-picture-section'
                  onClick={onClick}
                  onMouseEnter={() => this.mouse('image')}
                  onMouseLeave={() => this.mouseOut()}
                >
                  <div className='add-picture-button'>
                    <i className='fas fa-file-plus'></i>
                    <span>Thêm ảnh</span>
                  </div>
                </div>
              )}
            </InputFileWrapper>
          )}
        </div>

        {files.length > pictureLimit && (
          <div
            className={classnames('error-alert', {
              error: files.length > pictureLimit,
            })}
          >
            Bạn chỉ có thể chọn tối đa {pictureLimit} ảnh
          </div>
        )}

        {inputField &&
          inputField.map((each, i) => {
            // let listingInfoID = uuidv4();
            return (
              (!each.isDepended ||
                (each.isDepended && dependedInput[each.englishName])) &&
              (!each.isSelected ? (
                <ListingInfoInput
                  label={each.name}
                  key={each.englishName}
                  textArea={each.isTextArea}
                  id={each.englishName}
                  value={state[each.englishName]}
                  error={error[each.englishName]}
                  onMouseEnter={() => this.mouse(each.englishName)}
                  onMouseLeave={() => this.mouseOut()}
                  contentEditable={each.contentEditable}
                  onChange={(e) => {
                    each.errorMessage &&
                      handleCheckError(
                        each.englishName,
                        each.errorMessage,
                        e.target.value
                      );

                    each.numberOnly && each.isMoney
                      ? this.handlePriceDisplay(
                          each.englishName,
                          e.target.value
                        )
                      : each.numberOnly && !each.isMoney
                      ? checkNumber(e.target.value) &&
                        updateValue(`${each.englishName}`, e.target.value)
                      : updateValue(`${each.englishName}`, e.target.value);
                  }}
                />
              ) : (
                <ListingInfoSelect
                  label={each.name}
                  options={each.options}
                  displayAs={(item) => item.name}
                  key={each.englishName}
                  id={each.englishName}
                  value={
                    state[each.englishName] && {
                      name: state[each.englishName],
                    }
                  }
                  onMouseEnter={() => this.mouse(each.englishName)}
                  onMouseLeave={() => this.mouseOut()}
                  isSelected={(option) =>
                    option.name === (state[each.englishName] || each.default)
                  }
                  onChange={(value) => {
                    updateValue(`${each.englishName}`, value.name);
                  }}
                />
              ))
            );
          })}
      </div>
    );
  }
}
