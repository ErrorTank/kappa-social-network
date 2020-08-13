import React, { Component } from 'react';
import { classnames } from 'classnames';
import { userInfo } from './../../../../../../../common/states/common';
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
    const { title, price, category, condition, type, ...other } = state;
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
                <div className='info-title'>
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
                <div className='addition-info-header'>Chi tiết</div>
                <div className='addition-info-body'>
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
                          <div className='addition-info-type'>{each.title}</div>
                          <div className='addition-info-content'>
                            {state[each.name]}
                          </div>
                        </div>
                      )
                    );
                  })}
                  <div className='decription-wrapper'>
                    {state.decription
                      ? state.decription
                      : 'Phần mô tả sẽ hiển thị tại đây'}
                  </div>
                  <div className='location-wrapper'>
                    <div className='location-info'>
                      {state.position ? state.position : 'Vị trí...'}
                    </div>
                    <div className='addition-text'>
                      Đây là chỉ vị trí gần đúng
                    </div>
                  </div>
                </div>
              </div>

              <div className='seller-info-wrapper'>
                <div className='seller-info-header'>Thông tin về người bán</div>
                <div className='seller-info-body'>
                  <div className='user-avatar-wrapper'>
                    <img src={user.avatar} alt='user avatar' />
                  </div>
                  <div className='user-info-wrapper'>
                    <div className='user-name'>{user.basic_info.username}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className='send-info-wrapper'></div>
          </div>
        </div>
      </div>
    );
  }
}
