import React, { Component } from 'react';

export class MarketplaceFilterSection extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className='marketplace-filter-section'>
        <h2 className='marketplace-filter-title'>Bộ lọc</h2>
        <div className='marketplace-filter-props'>
          <div className='filter-by-position'>
            Hà Nội <span className='dot'> · </span>Trong vòng 60km
          </div>
        </div>
      </div>
    );
  }
}
