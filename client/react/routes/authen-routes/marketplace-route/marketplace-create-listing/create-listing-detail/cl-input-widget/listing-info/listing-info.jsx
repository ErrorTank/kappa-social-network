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
    this.state = {
      dependedInput: '',
      inputField: '',
      error: {
        title: '',
        price: '',
      },
    };
  }
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
  componentDidUpdate(prevProps) {
    if (prevProps.state.type !== this.props.state.type) {
      this.handleInputDisplay();
    }
    if (
      prevProps.match.params.categoryName !==
      this.props.match.params.categoryName
    ) {
      this.props.updateValue('type', this.props.match.params.categoryName);
    }
    if (prevProps.state.category !== this.props.state.category) {
      this.handleSetDependent(fieldByCategory, this.props.state.category);
    }
    if (prevProps.state.vehicleType !== this.props.state.vehicleType) {
      this.handleSetDependent(fieldByVehicleType, this.props.state.vehicleType);
    }
    if (prevProps.state.homeFor !== this.props.state.homeFor) {
      this.handleSetDependent(fieldByHomeFor, this.props.state.homeFor);
    }
  }
  handleCheckError = (name, message) => {
    const { state, updateValue } = this.props;
    if (!state[name]) {
      this.setState((prevState) => ({
        error: {
          ...prevState.error,
          [name]: message,
        },
      }));
    } else {
      this.setState((prevState) => ({
        error: {
          ...prevState.error,
          [name]: '',
        },
      }));
    }
  };
  render() {
    const { state, updateValue } = this.props;
    let { pictureLimit, type, category, ...other } = state;
    const { inputField, error, dependedInput } = this.state;
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
                (each.isDepended && dependedInput[each.englishName])) &&
              (!each.isSelected ? (
                <ListingInfoInput
                  label={each.name}
                  key={each.englishName}
                  textArea={each.isTextArea}
                  id={each.englishName}
                  value={state[each.englishName]}
                  error={error[each.englishName]}
                  onChange={(e) => {
                    each.errorMessage &&
                      this.handleCheckError(
                        each.englishName,
                        each.errorMessage
                      );
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
                  isSelected={(option) =>
                    option.name === state[each.englishName]
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
