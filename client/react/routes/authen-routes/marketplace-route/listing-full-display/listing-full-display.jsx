import React, { Component } from 'react';
import { listingApi } from './../../../../../api/common/listing-api';
import { PageTitle } from './../../../../common/page-title/page-title';
import { ImageSlider } from './../marketplace-create-listing/create-listing-detail/cl-preview-widget/image-slider/image-slider';
import { Button } from './../../../../common/button/button';
import classnames from 'classnames';
import { numberToMoney } from '../../../../../common/utils/listing-utils';
import { Breadcrumbs } from '../../../../common/breabcrumbs/breadcrumbs';
import moment from 'moment';
import { Avatar } from './../../../../common/avatar/avatar';
import { sellMessengerModal } from './../../../../common/modal/sell-messenger-modal/sell-messenger-modal';

class ListingFullDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listing: {
        files: {},
      },
      message: '',
      questionArr: null,
    };
    listingApi
      .getListingByListingID(this.props.match.params.listingID)
      .then((e) => {
        this.setQuestionArr(e);
        this.setState({ listing: e });
      });
  }

  suggestQuestion = [
    {
      type: 'item',
      question: [
        'Tôi quan tâm đến mặt hàng này.',
        'Mặt hàng này còn chứ?',
        'Mặt hàng ở tình trạng như thế nào?',
        'Bạn có giao hàng không?',
      ],
    },
    {
      type: 'rent',
      question: [
        'Ngày bắt đầu cho thuê có linh hoạt không?',
        'Có phí đặt cọc hay phí nào khắc không?',
        'Có bao gồm điện, nước, điện thoại và Internet không?',
      ],
    },
  ];

  setQuestionArr = (listing) => {
    const {
      title,
      make,
      year,
      model,
      price,
      user,
      homeType,
      address,
      files,
    } = listing;

    this.suggestQuestion.map((e) => {
      if ((title || make) && e.type === 'item') {
        this.setState({ questionArr: e.question });
      }
      if (homeType && e.type === 'rent') {
        this.setState({ questionArr: e.question });
      }
    });
  };

  buttonArr = [
    {
      icon: <i className='fab fa-facebook-messenger'></i>,
      className: 'facebook-button long',
      text: 'Nhắn tin',
      click: () =>
        sellMessengerModal.open({
          listing: this.state.listing,
          questionArr: this.state.questionArr,
        }),
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
    // {
    //   name: 'vehicleCondition',
    //   title: 'Trạng thái xe',
    // },
    // {
    //   name: 'vehicleCondition',
    //   title: 'Trạng thái xe',
    // },
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
      user,
      homeType,
      address,
      files,
    } = listing;
    // console.log(listing);
    // console.log(user);
    return (
      <PageTitle title={'Listing'}>
        <div className='listing-full-display'>
          <div className='picture-display-section'>
            <ImageSlider files={files} />
          </div>
          <div className='listing-all-info-section'>
            <div className='info-display-wrapper'>
              <div className='main-info-wrapper'>
                <div className={classnames('info-title')}>
                  {title ? title : make ? `${make} ${model} ${year}` : homeType}
                </div>
                <div className={classnames('info-price')}>
                  {price && numberToMoney(price.toString())}
                </div>
                <Breadcrumbs categoryID={category} isListing={true} />
                <div className='info-time-position'>
                  Đã niêm yết {moment(postTime).fromNow()} trước tại {location}
                </div>
              </div>

              <div className='button-section-wrapper'>
                {this.buttonArr.map((e, i) => (
                  <Button
                    className={classnames(e.className)}
                    key={i}
                    onClick={e.click}
                  >
                    {e.icon}
                    {e.text && <span>{e.text}</span>}
                  </Button>
                ))}
              </div>

              <div className='addition-info-wrapper'>
                <div className='addition-info-header'>Chi tiết</div>
                <div className='addition-info-body'>
                  <div className={classnames('addition-wrapper')}>
                    {this.additionInfo.map((each) => {
                      return (
                        listing[each.name] && (
                          <div className='addition-info' key={each.title}>
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
                    <div className='decription-header'>Mô tả của người bán</div>
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
                      {location ? location : address ? address : 'Vị trí...'}
                    </div>
                    <div className='addition-text'>
                      Đây là chỉ vị trí gần đúng
                    </div>
                  </div>
                </div>
              </div>

              {user && (
                <div className='seller-info-wrapper'>
                  <div className='seller-info-header'>
                    Thông tin về người bán
                  </div>
                  <div className='seller-info-body'>
                    <div className='seller-avatar-wrapper'>
                      <Avatar user={user && user} />
                    </div>
                    <div className='seller-name-wrapper'>
                      <div className='user-name'>
                        {user && user.basic_info.username}
                      </div>
                      <div className='join-time'>
                        Tham gia vào {moment(user.joined_at).format('YYYY')}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className='send-message-wrapper'>
              <div className='send-message-header'>
                <i className='fab fa-facebook-messenger'></i>
                <div className='send-message-title'>
                  Gửi tin nhắn cho người bán
                </div>
              </div>
              <div className='message-example'>Mặt hàng này còn chứ</div>
              <div className='send-message-demo'>Gửi</div>
            </div>
          </div>
          <div className='blank-section'></div>
        </div>
      </PageTitle>
    );
  }
}

export default ListingFullDisplay;
