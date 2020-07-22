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
import { omit, toArray } from 'lodash';

export class ListingInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleInputDisplay = () => {
    const { state, updateValue } = this.props;
    let { pictureLimit, type, category, ...other } = state;
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
  handleCheckDependent = () => {
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
        this.handleSetDependent(fieldByCategory, category);
        break;
      case 'vehicle':
        this.handleSetDependent(fieldByVehicleType, vehicleType);
        break;
      case 'home':
        this.handleSetDependent(fieldByHomeFor, homeFor);
        break;
    }
  };
  handleSetDependent = (obj, dependent) => {
    const { state, updateValue } = this.props;
    let { pictureLimit, type, ...other } = state;
    obj.map((each) => {
      if (each.name === dependent) {
        let result = omit(each, ['_id', 'name']);
        Object.keys(result).map((each) => {
          this.setState({ [each]: result[each] });
        });
      }
    });
  };
  componentDidUpdate(prevProps) {
    if (prevProps.state.type !== this.props.state.type) {
      this.handleInputDisplay();
    }
    if (prevProps.state.category !== this.props.state.category) {
      this.handleCheckDependent();
    }
    if (prevProps.state.vehicleType !== this.props.state.vehicleType) {
      this.handleCheckDependent();
    }
    if (prevProps.state.homeFor !== this.props.state.homeFor) {
      this.handleCheckDependent();
    }
  }

  render() {
    const { state, updateValue } = this.props;
    let { pictureLimit, type, category, ...other } = state;
    const { inputField } = this.state;
    console.log(this.state);
    console.log(this.props);

    return (
      <div className='listing-info'>
        <div className='picture-input'>
          <div className='picture-input-header'>
            Ảnh
            <span className='dot'> · </span>0 /{' '}
            {type && <span>{pictureLimit}</span>}
            <span className='sub'>
              {' '}
              - Bạn có thể thêm tối đa {pictureLimit} ảnh
            </span>
          </div>
          <div className='add-picture-section'></div>
        </div>

        {inputField &&
          inputField.map((each, i) => {
            // let listingInfoID = uuidv4();
            return (
              (!each.isDepended ||
                (each.isDepended && this.state[each.englishName])) &&
              (!each.isSelected ? (
                <ListingInfoInput
                  label={each.name}
                  key={each.englishName}
                  textArea={each.isTextArea}
                  id={each.englishName}
                  value={state[each.englishName]}
                  // updateValue={updateValue}
                  onChange={(e) => {
                    updateValue(`${each.englishName}`, e.target.value);
                  }}
                />
              ) : (
                <ListingInfoSelect
                  label={each.name}
                  options={each.options}
                  displayAs={(item) => item}
                  key={each.englishName}
                  id={each.englishName}
                  value={state[each.englishName]}
                  isSelected={(option) => option === state[each.englishName]}
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
