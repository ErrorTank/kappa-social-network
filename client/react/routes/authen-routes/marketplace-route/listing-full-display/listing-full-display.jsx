import React, { Component } from 'react';
import { listingApi } from './../../../../../api/common/listing-api';
import { PageTitle } from './../../../../common/page-title/page-title';
import { ImageSlider } from './../marketplace-create-listing/create-listing-detail/cl-preview-widget/image-slider/image-slider';
import { Button } from './../../../../common/button/button';
import classnames from 'classnames';
import { numberToMoney } from '../../../../../common/utils/listing-utils';
import { Breadcrumbs } from '../../../../common/breabcrumbs/breadcrumbs';
import moment from 'moment';
import { userApi } from './../../../../../api/common/user-api';

class ListingFullDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listing: {
        files: {},
      },
    };
    listingApi
      .getListingByListingID(this.props.match.params.listingID)
      .then((e) => this.setState({ listing: e }));
    // userApi.getUserBasicInfo()
  }
  buttonArr = [
    {
      icon: <i className='fab fa-facebook-messenger'></i>,
      className: 'facebook-button long',
      text: 'Nhắn tin',
    },
    {
      icon: <i className='fas fa-bookmark'></i>,
      className: 'facebook-button',
    },
    {
      icon: <i className='fas fa-share'></i>,
      className: 'facebook-button',
    },
    {
      icon: <i className='fas fa-ellipsis-h'></i>,
      className: 'facebook-button',
    },
  ];
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
    const { listing } = this.state;
    const {
      title,
      make,
      year,
      model,
      price,
      location,
      category,
      postTime,
      condition,
      decription,
    } = listing;
    console.log(listing);
    return (
      <PageTitle title={'Listing'}>
        <div className='listing-full-display'>
          <div className='picture-display-section'>
            <ImageSlider files={listing.files} />
          </div>
          <div className='listing-all-info-section'>
            <div className='info-display-wrapper'>
              <div className='main-info-wrapper'>
                <div className={classnames('info-title')}>
                  {title ? title : make ? `${make} ${model} ${year}` : 'nhaf'}
                </div>
                <div className={classnames('info-price')}>
                  {price ? numberToMoney(price.toString()) : 'Giá'}
                </div>
                <Breadcrumbs categoryID={category} isListing={true} />
                <div className='info-time-position'>
                  Đã niêm yết {moment(postTime).fromNow()} trước tại{' '}
                  {location || '...'}
                </div>
              </div>

              <div className='button-section-wrapper'>
                {this.buttonArr.map((e) => (
                  <Button className={classnames(e.className)} key={e.icon}>
                    {e.icon}
                    {e.text && <span>{e.text}</span>}
                  </Button>
                ))}
              </div>

              <div className='addition-info-wrapper'>
                <div className='addition-info-header'>Chi tiết</div>
                <div className='addition-info-body'>
                  <div className={classnames('addition-wrapper')}>
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
                        listing[each.name] && (
                          <div className='addition-info'>
                            <div className='addition-info-type'>
                              {each.title}
                            </div>
                            <div className='addition-info-content'>
                              {listing[each.name]}
                            </div>
                          </div>
                        )
                      );
                    })}
                  </div>

                  <div className={classnames('decription-wrapper')}>
                    {decription && decription}
                  </div>
                  <div className={classnames('location-wrapper')}>
                    <div className='example-map'>
                      <img
                        src={
                          'https://localhost:2000/assets/images/others/best-google-maps-plugins.png'
                        }
                        alt=''
                      />
                    </div>
                    <div className='location-info'>
                      {location ? location : 'Vị trí...'}
                    </div>
                    <div className='addition-text'>
                      Đây là chỉ vị trí gần đúng
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className='seller-info-wrapper'>
                <div className='seller-info-header'>Thông tin về người bán</div>
                <div className='seller-info-body'>
                  <div className='seller-avatar-wrapper'>
                    <Avatar user={user} />
                  </div>
                  <div className='seller-name-wrapper'>
                    <div className='user-name'>{user.basic_info.username}</div>
                  </div>
                </div>
              </div> */}
            </div>

            {/* <div className='send-message-wrapper'>
              <div className='send-message-header gray-filter'>
                <i className='fab fa-facebook-messenger'></i>
                <div className='send-message-title'>
                  Gửi tin nhắn cho người bán
                </div>
              </div>
              <div className='message-example'>Mặt hàng này còn chứ</div>
              <div className='send-message-demo gray-filter'>Gửi</div>
            </div> */}
          </div>
          <div className='blank-section'></div>
        </div>
      </PageTitle>
    );
  }
}

export default ListingFullDisplay;
