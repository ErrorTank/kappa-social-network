import React, { Component } from 'react';
import { ListingInfoInput } from '../../../../../../../common/listing-info-input/listing-info-input';
import {
  fieldByCategory,
  itemField,
  vehicleField,
  fieldByVehicleType,
  homeField,
} from './../../../../../../../../const/listing';
import { customHistory } from './../../../../../../routes';
import { ListingInfoSelect } from './../../../../../../../common/listing-info-select/listing-info-select';
import { v4 as uuidv4 } from 'uuid';
import omit from 'lodash/omit';

export class ListingInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidUpdate = () => {
    const { state, updateValue } = this.props;
    let { pictureLimit, type, category, ...other } = state;
    switch (type) {
      case 'item':
        this.setState({ inputField: itemField });
        if (category) {
          fieldByCategory.map((each) => {
            if (each.name === category) {
              let result = omit(each, ['_id', 'name']);
              this.setState({ ...result });
            }
          });
        }

        // console.log(state.category);
        break;
      case 'vehicle':
        this.setState({ inputField: vehicleField });
        break;
      case 'home':
        this.setState({ inputField: homeField });
        break;
    }
  };
  render() {
    const { state, updateValue } = this.props;
    let { pictureLimit, type, category, ...other } = state;

    const { inputField } = this.state;
    // console.log(this.props.state);
    // console.log(customHistory);
    console.log(this.state);

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
            return !each.isSelected ? (
              <ListingInfoInput
                label={each.name}
                key={each.englishName}
                textArea={each.isTextArea}
                id={each.englishName}
                value={state[each.englishName]}
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
            );
          })}
      </div>
    );
  }
}
