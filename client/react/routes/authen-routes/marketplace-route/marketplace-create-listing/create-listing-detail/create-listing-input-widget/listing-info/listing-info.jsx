import React, { Component } from 'react';
import { ListingInfoInput } from '../../../../../../../common/listing-info-input/listing-info-input';
import {
  fieldByCategory,
  itemField,
} from './../../../../../../../../const/listing';
import { customHistory } from './../../../../../../routes';

export class ListingInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  pictureLimit = [
    {
      name: 'item',
      limit: 10,
    },
    {
      name: 'vehicle',
      limit: 20,
    },
    {
      name: 'house',
      limit: 50,
    },
  ];
  componentDidMount = () => {
    const { type, updateValue } = this.props;
    updateValue('type', type);
    this.pictureLimit.forEach((each) => {
      type === each.name && updateValue('limit', each.limit);
    });
  };

  render() {
    const { state, updateValue, type, limit } = this.props;
    console.log(type);
    // console.log(this.pictureLimit);
    return (
      <div className='listing-info'>
        <div className='picture-input'>
          <div className='picture-input-header'>
            Ảnh
            <span className='dot'> · </span>0 / {type && <span>{limit}</span>}
            <span className='sub'> - Bạn có thể thêm tối đa 10 ảnh</span>
          </div>
          <div className='add-picture-section'></div>
        </div>

        {itemField.map((each, i) => {
          return <ListingInfoInput label={each.name} key={each.name} />;
        })}
      </div>
    );
  }
}
