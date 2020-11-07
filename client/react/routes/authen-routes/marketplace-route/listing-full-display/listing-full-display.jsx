import React, { Component } from 'react';
import { listingApi } from './../../../../../api/common/listing-api';
import { PageTitle } from './../../../../common/page-title/page-title';
import { ImageSlider } from './../marketplace-create-listing/create-listing-detail/cl-preview-widget/image-slider/image-slider';
import { Button } from './../../../../common/button/button';
import classnames from 'classnames';
import { numberToMoney } from '../../../../../common/utils/listing-utils';
import { Breadcrumbs } from '../../../../common/breabcrumbs/breadcrumbs';

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
  }
  render() {
    const { listing } = this.state;
    const { title, make, year, model, price, location, category } = listing;
    let priceMoney = '';
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
                <Breadcrumbs categoryID={category} />
                <div className='info-time-position'>
                  Đã niêm yết vài giây trước tại {location || '...'}
                </div>
              </div>
              {/*
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
                    <div className='example-map'>
                      <img
                        src={
                          'https://localhost:2000/assets/images/others/best-google-maps-plugins.png'
                        }
                        alt=''
                      />
                    </div>
                    <div className='location-info'>
                      {state.location ? state.location : 'Vị trí...'}
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
