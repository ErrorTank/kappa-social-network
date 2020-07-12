import React, { Component } from 'react';
import { ListingInfoInput } from '../../../../../../../common/listing-info-input/listing-info-input';
import {
  fieldByCategory,
  itemField,
} from './../../../../../../../../const/listing';
import { customHistory } from './../../../../../../routes';
import { ListingInfoSelect } from './../../../../../../../common/listing-info-select/listing-info-select';
import { v4 as uuidv4 } from 'uuid';

export class ListingInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: null,
      condition: null,
      material: null,
    };
  }

  render() {
    const { state, updateValue } = this.props;
    let { pictureLimit, type, ...other } = state;
    console.log(this.props);
    let listingInfoID = uuidv4();
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

        {itemField.map((each, i) => {
          // console.log(each);
          return !each.isSelected ? (
            <ListingInfoInput
              label={each.name}
              key={listingInfoID}
              textArea={each.isTextArea}
              id={each.englishName}
              // value={}
              onChange={(e) => {
                updateValue(`${each.englishName}`, e.target.value);
              }}
            />
          ) : (
            // <ListingInfoSelect
            //   label={each.name}
            //   options={each.options}
            //   displayAs={(label) => label}
            //   key={listingInfoID}
            //   id={each.englishName}
            //   // value={each.name}
            // />
            <div>ok</div>
          );
        })}
      </div>
    );
  }
}
