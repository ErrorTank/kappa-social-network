import React, { Component } from 'react';
import { KComponent } from './../../../../../common/k-component';

export class MarketplaceFilterSection extends KComponent {
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
            Từ vị trí của bạn <span className='dot'> · </span>
            {`Trong vòng ${this.props.radius} km`}
          </div>
          {this.props.children}
        </div>
      </div>
    );
  }
}
