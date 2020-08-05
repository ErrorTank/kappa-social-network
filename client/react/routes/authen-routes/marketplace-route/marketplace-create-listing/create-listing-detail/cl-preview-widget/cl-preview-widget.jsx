import React, { Component } from 'react';

export class CreateListingPreviewWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { state } = this.props;
    const { title } = state;
    console.log(state);
    return (
      <div className='create-listing-preview-widget'>
        <div className='preview-header-wrapper'>
          <div className='preview-header'>Xem trước</div>
        </div>
        <div className='preview-display-wrapper'>
          <div className='picture-display-section'></div>
          <div className='listing-info-section'>
            <div className='main-info-wrapper'>{title ? title : 'Tiêu đề'}</div>
          </div>
        </div>
      </div>
    );
  }
}
