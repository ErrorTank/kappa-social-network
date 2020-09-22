import React, { Component } from 'react';
import { ListingInfoSelect } from './../../../../../common/listing-info-select/listing-info-select';

export class MarketplaceFilterSection extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  radiusArr = [
    {
      value: 1,
    },
    {
      value: 2,
    },
    {
      value: 5,
    },
    {
      value: 10,
    },
    {
      value: 20,
    },
    {
      value: 40,
    },
    {
      value: 60,
    },
  ];
  render() {
    return (
      <div className='marketplace-filter-section'>
        <h2 className='marketplace-filter-title'>Bộ lọc</h2>
        <div className='marketplace-filter-props'>
          <div className='filter-by-position'>
            Hà Nội <span className='dot'> · </span>`Trong vòng $
            {this.props.radius}km`
          </div>
          <ListingInfoSelect
            label={'Bán kính'}
            options={this.radiusArr}
            displayAs={(item) => `${item.value} km `}
            value={this.props.radius}
            isSelected={(option) => option.value === this.props.radius}
            onChange={(e) => {
              updateValue(`radius`, e.value);
            }}
          />
        </div>
      </div>
    );
  }
}
