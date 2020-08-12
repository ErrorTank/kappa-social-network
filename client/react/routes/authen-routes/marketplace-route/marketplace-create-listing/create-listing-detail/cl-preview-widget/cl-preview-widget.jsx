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
                <div className='info-time-position'>
                  Đã niêm yết vài giây trước tại Hà Nội{' '}
                </div>
              </div>

              <div className='button-section-wrapper'>
                <div className='button-display send-text'>
                  <i class='fab fa-facebook-messenger'></i>
                  <span>Nhắn tin</span>
                </div>
                <div className='button-display'>
                  <i class='fas fa-bookmark'></i>
                </div>
                <div className='button-display'>
                  <i class='fas fa-share'></i>
                </div>
                <div className='button-display'>
                  <i class='fas fa-ellipsis-h'></i>
                </div>
              </div>

              <div className='addition-info-wrapper'>
                <div className='addition-info-title'>Chi tiết</div>
              </div>
            </div>
            <div className='send-info-wrapper'></div>
          </div>
        </div>
      </div>
    );
  }
}
