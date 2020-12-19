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
import { CommonInput } from '../../../../common/common-input/common-input';
import { Tooltip } from './../../../../common/tooltip/tooltip';
import { userInfo } from './../../../../../common/states/common';
import { messengerApi } from './../../../../../api/common/messenger-api';
import { chatApi } from './../../../../../api/common/chat-api';
import { messageWidgetController } from './../../../../layout/authen-layout/create-message-widget/create-message-widget';
import { v4 as uuidv4 } from 'uuid';
import { MESSAGE_TYPES } from '../../../../layout/authen-layout/create-message-widget/chat-box/message-section/message';
import { MessageState } from './../../../../layout/authen-layout/create-message-widget/chat-box/chat-box';
import omit from 'lodash/omit';
import { createPostModal } from './../../../../common/create-post-modal/create-post-modal';

class ListingFullDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listing: {
        files: {},
      },
      message: 'Mặt hàng này còn chứ?',
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

  createTempMessage = ({ state = {}, needUploadFile = false, file = null }) => {
    let newMessageID = uuidv4();
    return {
      _id: newMessageID,
      sentBy: { _id: userInfo.getState()._id },
      content: state.content || '',
      mentions: state.mentions || [],
      special: MESSAGE_TYPES.CASUAL,
      hyperlinks: state.hyperlinks || [],
      state: MessageState.CACHED,
      call_info: state.call_info || null,
      reactions: {
        angry: [],
        cry: [],
        laugh: [],
        love: [],
        thump_down: [],
        thump_up: [],
        wow: [],
      },
      seenBy: [],
      temp: true,
      needUploadFile,
      file,
      emoji: state.emoji || null,
      reply_for: state.reply
        ? {
            file: state.reply.file,
            content: state.reply.content,
            sentBy: state.reply.sentBy,
            emoji: state.reply.emoji,
          }
        : null,
    };
  };
  handleSendSellMessage = (chatState) => {
    let { user } = this.state.listing;
    messengerApi.getUserChatRoomBrief(user._id).then(({ chat_room }) => {
      // console.log(chat_room);

      let newMessage = null;
      if (chatState.content) {
        newMessage = this.createTempMessage({ state: chatState });
      }
      chatApi
        .sendMessage(
          chat_room._id,
          omit(
            {
              ...newMessage,
              sentBy: newMessage.sentBy._id,
              reply_for: newMessage.reply_for
                ? {
                    ...newMessage.reply_for,
                    sentBy: newMessage.reply_for.sentBy._id,
                  }
                : null,
            },
            ['state', 'temp', 'needUploadFile', 'file']
          )
        )
        .then((e) =>
          messageWidgetController.focusOnChatBox({
            userID: user._id,
          })
        );
    });
  };

  getSavedListing = (userID, savedUser = []) => {
    // console.log(savedUser);
    if (savedUser.find((each) => each === userID)) {
      return true;
    }
    return null;
  };
  handleSavedListing = () => {
    const { listing } = this.state;
    const { savedUser } = listing;
    let activeSave = this.getSavedListing(userInfo.getState()._id, savedUser);

    listingApi
      .saveListing(
        userInfo.getState()._id,
        activeSave ? { off: true } : { on: true },
        this.state.listing._id
      )
      .then((e) => {
        // console.log(e);
        this.setState({ listing: e });
      });
  };
  buttonArr = [
    {
      icon: <i className='fab fa-facebook-messenger'></i>,
      className: 'facebook-button long',
      text: 'Nhắn tin',
      tooltipText: 'Nhắn tin',
      canDisable: true,
      click: () =>
        sellMessengerModal.open({
          listing: this.state.listing,
          questionArr: this.state.questionArr,
        }),
    },
    {
      icon: <i className='fas fa-bookmark'></i>,
      className: 'facebook-button',
      tooltipText: 'Lưu',
      click: () => this.handleSavedListing(),
    },
    {
      icon: <i className='fas fa-share'></i>,
      className: 'facebook-button',
      tooltipText: 'Chia sẻ',
      click: () =>
        createPostModal.open({
          placeholder: `Bình luận của bạn?`,
          shareMarketplace: true,
          listing: this.state.listing,
        }),
    },
    // {
    //   icon: <i className='fas fa-ellipsis-h'></i>,
    //   className: 'facebook-button',
    // },
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

  handleMessageChange = (value) => {
    this.setState({ message: value });
  };
  render() {
    const currentUser = userInfo.getState();
    const { listing, message } = this.state;
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
      savedUser,
      isStocked,
    } = listing;
    let activeSave = this.getSavedListing(currentUser._id, savedUser);
    // console.log(activeSave);
    // console.log(listing);
    // console.log(user);
    // console.log(currentUser);
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
                  {` · `}
                  <div
                    className={classnames('stock-wrapper', {
                      runout: !isStocked,
                    })}
                  >
                    {!isStocked ? 'Hết hàng' : 'Còn hàng'}
                  </div>
                </div>
                <Breadcrumbs categoryID={category} isListing={true} />
                <div className='info-time-position'>
                  Đã niêm yết {moment(postTime).fromNow()} trước tại {location}
                </div>
              </div>

              <div className='button-section-wrapper'>
                {this.buttonArr.map((e, i) => (
                  <Tooltip
                    key={e.tooltipText}
                    text={() =>
                      activeSave && e.tooltipText === 'Lưu'
                        ? 'Đã Lưu'
                        : e.tooltipText
                    }
                    position={'top'}
                  >
                    <Button
                      className={classnames(e.className, {
                        active: activeSave && e.tooltipText === 'Lưu',
                      })}
                      key={i}
                      onClick={e.click}
                      disabled={
                        (user &&
                          e.canDisable &&
                          currentUser._id === user._id) ||
                        (isStocked && e.tooltipText === 'Nhắn tin')
                      }
                    >
                      {e.icon}
                      {e.text && <span>{e.text}</span>}
                    </Button>
                  </Tooltip>
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

            <div
              className='send-message-wrapper'
              onClick={() => {
                if (user && currentUser._id !== user._id && isStocked) {
                  const { message } = this.state;
                  if (message) {
                    this.handleSendSellMessage({
                      content: message,
                      files: [],
                    });
                  }
                }
              }}
            >
              <div className='send-message-header'>
                <i className='fab fa-facebook-messenger'></i>
                <div className='send-message-title'>
                  Gửi tin nhắn cho người bán
                </div>
              </div>

              <CommonInput
                type='text'
                value={message}
                onChange={(e) => this.handleMessageChange(e.target.value)}
                className='message-example'
              />
              <div
                className={classnames('send-message-demo', {
                  'gray-filter':
                    !message ||
                    (user && currentUser._id === user._id) ||
                    !isStocked,
                })}
              >
                Gửi
              </div>
            </div>
          </div>
          <div className='blank-section'></div>
        </div>
      </PageTitle>
    );
  }
}

export default ListingFullDisplay;
