import React, { Component } from 'react';
import { KComponent } from './../../../../../common/k-component';
import { ListingInfoSelect } from './../../../../../common/listing-info-select/listing-info-select';
import { radiusArr } from './../../../../../../const/listing';
import { SelectRadio } from '../../../../../common/marketplace-filter/select-radio';

export class MarketplaceFilterSection extends KComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let sortOptions = [
      {
        label: 'Giá: Thấp nhất trước',
        value: 'Lowest price first',
      },
      {
        label: 'Giá: Cao nhất trước',
        value: 'Highest price first',
      },
    ];
    const { updateValue, radius, state, handleState, isFilter } = this.props;
    // const { sortType } = state;
    // console.log(state);
    return (
      <div className='marketplace-filter-section'>
        <h2 className='marketplace-filter-title'>Bộ lọc</h2>
        <div className='marketplace-filter-props'>
          <div className='filter-by-position'>
            Từ vị trí của bạn <span className='dot'> · </span>
            {`Trong vòng ${radius} km`}
            <ListingInfoSelect
              label={'Bán kính'}
              options={radiusArr}
              displayAs={(item) => item.value + ' km'}
              value={{ value: radius }}
              isSelected={(option) => option.value === radius}
              onChange={(e) => updateValue(`radius`, e.value)}
            />
          </div>

          {isFilter && (
            <SelectRadio title={'Sắp xếp theo'} options={sortOptions} />
          )}
        </div>
      </div>
    );
  }
}
