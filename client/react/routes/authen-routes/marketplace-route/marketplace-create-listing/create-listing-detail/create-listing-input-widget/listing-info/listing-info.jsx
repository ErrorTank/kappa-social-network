import React, { Component } from 'react';

export class ListingInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className='listing-info'>
        <div className='picture-input'>
          <div className='picture-input-header'>
            Ảnh
            <span className='dot'> · </span>0 / 10
            <span className='sub'> - Bạn có thể thêm tối đa 10 ảnh</span>
          </div>
          <div className='add-picture-section'></div>
        </div>
      </div>
    );
  }
}
