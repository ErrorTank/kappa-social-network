import React, { Component } from 'react';
import classnames from 'classnames';
import { userInfo } from './../../../../../../../common/states/common';
import { ImageSlider } from './image-slider/image-slider';

export class CreateListingPreviewWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  additionInfo = [
    {
      name: 'brand',
      title: 'Thương hiệu',
    },
    {
      name: 'platform',
      title: 'Nền tảng',
    },
    {
      name: 'size',
      title: 'Kích thước',
    },
    {
      name: 'carrie',
      title: 'Nhà mạng',
    },
    {
      name: 'deviceName',
      title: 'Tên thiết bị',
    },
    {
      name: 'material',
      title: 'Chất liệu',
    },
  ];
  render() {
    let user = userInfo.getState();
    const { state } = this.props;
    const {
      title,
      price,
      category,
      condition,
      type,
      hoverArr,
      files,
      ...other
    } = state;
    // console.log(state.files);

    return (
      <div className='create-listing-preview-widget'>
        <div className='preview-header-wrapper'>
          <div className='preview-header'>Xem trước</div>
        </div>
        <div className='preview-display-wrapper'>
          <div
            className={classnames('picture-display-section', {
              'on-mouse-image': hoverArr === 'image',
            })}
          >
            {!!files.length ? (
              <ImageSlider files={files} />
            ) : (
              <div className='image-empty-placeholder'>
                <div className='ie-placeholder-title'>
                  Xem trước bài niêm yết của bạn
                </div>
                <span className='ie-placeholder-content'>
                  Trong khi tạo, bạn có thể xem trước để biết bài niêm yết sẽ
                  hiển thị thế nào với mọi người trên Marketplace.
                </span>
              </div>
            )}
          </div>
          <div className='listing-info-section'>
            <div className='info-display-wrapper'>
              <div className='main-info-wrapper'>
                <div
                  className={classnames('info-title', {
                    'on-mouse': hoverArr === 'title',
                  })}
                >
                  {type === 'item'
                    ? title
                      ? title
                      : 'Tiêu đề'
                    : type === 'vehicle'
                    ? state.make || state.year || state.model
                      ? `${state.year} ${state.make} ${state.model}`
                      : 'Tiêu đề'
                    : state.homeType
                    ? state.homeType
                    : 'Tiêu đề'}
                </div>
                <div
                  className={classnames('info-price', {
                    'on-mouse': hoverArr === 'price',
                  })}
                >
                  {price ? price : 'Giá'}
                </div>
                <div className='info-time-position'>
                  Đã niêm yết vài giây trước tại {state.location || '...'}{' '}
                </div>
              </div>

              <div className='button-section-wrapper gray-filter'>
                <div className='button-display send-text'>
                  <i className='fab fa-facebook-messenger'></i>
                  <span>Nhắn tin</span>
                </div>
                <div className='button-display'>
                  <i className='fas fa-bookmark'></i>
                </div>
                <div className='button-display'>
                  <i className='fas fa-share'></i>
                </div>
                <div className='button-display'>
                  <i className='fas fa-ellipsis-h'></i>
                </div>
              </div>

              <div className='addition-info-wrapper'>
                <div className='addition-info-header'>Chi tiết</div>
                <div className='addition-info-body'>
                  <div
                    className={classnames('addition-wrapper', {
                      'on-mouse': hoverArr === 'category',
                    })}
                  >
                    {category && (
                      <div className='addition-info'>
                        <div className='addition-info-type'>Tình trạng</div>
                        <div className='addition-info-content'>
                          {condition ? condition : '___'}
                        </div>
                      </div>
                    )}
                    {this.additionInfo.map((each) => {
                      return (
                        state[each.name] && (
                          <div className='addition-info'>
                            <div className='addition-info-type'>
                              {each.title}
                            </div>
                            <div className='addition-info-content'>
                              {state[each.name]}
                            </div>
                          </div>
                        )
                      );
                    })}
                  </div>
                  <div
                    className={classnames('decription-wrapper', {
                      'on-mouse': hoverArr === 'decription',
                    })}
                  >
                    {state.decription
                      ? state.decription
                      : 'Phần mô tả sẽ hiển thị tại đây'}
                  </div>
                  <div
                    className={classnames('location-wrapper', {
                      'on-mouse': hoverArr === 'location',
                    })}
                  >
                    <div className='location-info'>
                      {state.position ? state.position : 'Vị trí...'}
                    </div>
                    <div className='addition-text'>
                      Đây là chỉ vị trí gần đúng
                    </div>
                  </div>
                </div>
              </div>

              <div className='seller-info-wrapper gray-filter'>
                <div className='seller-info-header'>Thông tin về người bán</div>
                <div className='seller-info-body'>
                  <div className='seller-avatar-wrapper'>
                    <img src={user.avatar} alt='seller avatar' />
                  </div>
                  <div className='seller-name-wrapper'>
                    <div className='user-name'>{user.basic_info.username}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className='send-message-wrapper'>
              <div className='send-message-header gray-filter'>
                <i className='fab fa-facebook-messenger'></i>
                <div className='send-message-title'>
                  Gửi tin nhắn cho người bán
                </div>
              </div>
              <div className='message-example'>Mặt hàng này còn chứ</div>
              <div className='send-message-demo gray-filter'>Gửi</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
