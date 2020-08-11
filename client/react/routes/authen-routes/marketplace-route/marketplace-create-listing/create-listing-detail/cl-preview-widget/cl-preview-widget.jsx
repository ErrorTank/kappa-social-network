import React, { Component } from 'react';
import { classnames } from 'classnames';
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
            <div className='image-empty-placeholder'>
              <div className='ie-placeholder-title'>
                Xem trước bài niêm yết của bạn
              </div>
              <span className='ie-placeholder-content'>
                Trong khi tạo, bạn có thể xem trước để biết bài niêm yết sẽ hiển
                thị thế nào với mọi người trên Marketplace.
              </span>
            </div>
          </div>
          <div className='listing-info-section'>
            <div className='info-display-wrapper'>
              <div className='main-info-wrapper'>
                <div className='info-title'>{title ? title : 'Tiêu đề'}</div>
                <div className='info-price'>{price ? price : 'Giá'}</div>
              </div>
            </div>
            <div className='send-info-wrapper'></div>
          </div>
        </div>
      </div>
    );
  }
}
