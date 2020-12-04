import React, { Component } from 'react';
import classnames from 'classnames';
import { userInfo } from './../../../../../../../common/states/common';
import { ImageSlider } from './image-slider/image-slider';
import { Avatar } from './../../../../../../common/avatar/avatar';
import { Button } from './../../../../../../common/button/button';

export class CreateListingPreviewWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  additionInfo = [
    {
      name: 'condition',
      title: 'Tình trạng',
    },
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
    {
      name: 'vehicleCondition',
      title: 'Trạng thái xe',
    },
    {
      name: 'mileage',
      title: 'Số dặm đã đi',
    },
    {
      name: 'numberOfBedrooms',
      title: 'Số phòng ngủ',
    },
    {
      name: 'numberOfBathrooms',
      title: 'Số phòng tắm',
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
      make,
      year,
      model,
      homeType,
      decription,
      location,
      address,
      ...other
    } = state;
    // console.log(.files);

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
                  {title
                    ? title
                    : model || year || model
                    ? `${year} ${make} ${model}`
                    : homeType
                    ? homeType
                    : 'Tiêu đề'}
                </div>
                <div
                  className={classnames('info-price', {
                    'on-mouse': hoverArr === 'price',
                  })}
                >
                  {price ? price : 'Giá'}
                  {category === 'Cho thuê' && '/tháng'}
                </div>
                <div className='info-time-position'>
                  Đã niêm yết vài giây trước tại{' '}
                  {location ? location : address ? address : '...'}
                </div>
              </div>

              <div className='button-section-wrapper'>
                <Button
                  disabled={true}
                  className={classnames('facebook-button long')}
                >
                  <i className='fab fa-facebook-messenger'></i>
                  <span>Nhắn tin</span>
                </Button>
                <Button
                  disabled={true}
                  className={classnames('facebook-button')}
                >
                  <i className='fas fa-bookmark'></i>
                </Button>
                <Button
                  disabled={true}
                  className={classnames('facebook-button')}
                >
                  <i className='fas fa-share'></i>
                </Button>
                <Button
                  disabled={true}
                  className={classnames('facebook-button')}
                >
                  <i className='fas fa-ellipsis-h'></i>
                </Button>
              </div>

              <div className='addition-info-wrapper'>
                <div className='addition-info-header'>Chi tiết</div>
                <div className='addition-info-body'>
                  <div
                    className={classnames('addition-wrapper', {
                      'on-mouse': hoverArr === 'category',
                    })}
                  >
                    {this.additionInfo.map((each) => {
                      return (
                        state[each.name] && (
                          <div className='addition-info' key={each.name}>
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
                    {decription ? decription : 'Phần mô tả sẽ hiển thị tại đây'}
                  </div>
                  <div
                    className={classnames('location-wrapper', {
                      'on-mouse': hoverArr === 'location',
                    })}
                  >
                    <div className='example-map'>
                      <img
                        src={
                          'https://localhost:2000/assets/images/others/best-google-maps-plugins.png'
                        }
                        alt=''
                      />
                    </div>
                    <div className='location-info'>
                      {location ? location : address}
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
                    <Avatar user={user} />
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
