import React, { Component } from 'react';

export class CreateListingPreviewWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { state } = this.props;
    const { title, price } = state;
    console.log(state);
    return (
      <div className='create-listing-preview-widget'>
        <div className='preview-header-wrapper'>
          <div className='preview-header'>Xem trước</div>
        </div>
        <div className='preview-display-wrapper'>
          <div className='picture-display-section'>
            <div className='image-empty'>Xem trước bài niêm yết của bạn</div>
          </div>
          <div className='listing-info-section'>
            <div className='main-info-wrapper'>
              <div className='info-title'>{title ? title : 'Tiêu đề'}</div>
              <div className='info-price'>{price ? price : 'Giá'}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
