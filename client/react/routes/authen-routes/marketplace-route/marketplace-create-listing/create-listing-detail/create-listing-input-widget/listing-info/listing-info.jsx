import React, { Component } from 'react';
import { ListingInfoInput } from '../../../../../../../common/listing-info-input/listing-info-input';
import {
  fieldByCategory,
  itemField,
} from './../../../../../../../../const/listing';
import { customHistory } from './../../../../../../routes';
import { ListingInfoSelect } from './../../../../../../../common/listing-info-select/listing-info-select';

export class ListingInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    const { type, updateValue } = this.props;
    updateValue('type', type);
  };

  render() {
    const { state, updateValue, type, limit } = this.props;
    return (
      <div className='listing-info'>
        <div className='picture-input'>
          <div className='picture-input-header'>
            Ảnh
            <span className='dot'> · </span>0 / {type && <span>{limit}</span>}
            <span className='sub'> - Bạn có thể thêm tối đa {limit} ảnh</span>
          </div>
          <div className='add-picture-section'></div>
        </div>

        {itemField.map((each, i) => {
          return !each.isSelected ? (
            <ListingInfoInput
              label={each.name}
              key={each.name}
              textArea={each.isTextArea}
            />
          ) : (
            <ListingInfoSelect
              label={each.name}
              options={each.options}
              displayAs={(label) => label}
              key={each.name}
            />
          );
        })}
      </div>
    );
  }
}
