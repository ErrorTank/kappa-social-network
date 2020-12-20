import React, { Component } from 'react';
import { modals } from './../modals';
import { CommonModalLayout } from './../common-modal-layout';
import { numberToMoney } from '../../../../common/utils/listing-utils';
import { ListingInfoInput } from './../../listing-info-input/listing-info-input';
import { messageWidgetController } from './../../../layout/authen-layout/create-message-widget/create-message-widget';
import { messengerApi } from './../../../../api/common/messenger-api';
import { chatApi } from './../../../../api/common/chat-api';
import { v4 as uuidv4 } from 'uuid';
import { userInfo } from './../../../../common/states/common';
import { MESSAGE_TYPES } from '../../../layout/authen-layout/create-message-widget/chat-box/message-section/message';
import { MessageState } from './../../../layout/authen-layout/create-message-widget/chat-box/chat-box';
import omit from 'lodash/omit';

export const sellMessengerModal = {
  open(config) {
    const modal = modals.openModal({
      content: (
        <SellMessengerModal {...config} onClose={(e) => modal.close(e)} />
      ),
      // disabledOverlayClose: config.disabledClose,
    });
    return modal.result;
  },
};

class SellMessengerModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      questionArr: null,
    };
  }

  componentDidMount() {
    this.setQuestionArr();
  }

  handleMessageChange = (value) => {
    this.setState({ message: value });
  };

  suggestQuestion = [
    {
      type: 'item',
      question: [
        'Tôi quan tâm đến mặt hàng này.',
        'Mặt hàng này còn chứ?',
        'Mặt hàng ở tình trạng như thế nào?',
        'Bạn có giao hàng không?',
        `Sản phẩm: ${this.props.listing._id}`,
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

  setQuestionArr = () => {
    const { listing } = this.props;
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
    let { user } = this.props.listing;
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
        .then((e) => {
          messageWidgetController.focusOnChatBox({
            userID: user._id,
          });
        });
    });
  };
  render() {
    let { onClose, listing, handleMessageChange } = this.props;
    const { message, questionArr } = this.state;
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

    return (
      <CommonModalLayout
        className='sell-messenger-model'
        onClose={() => {
          onClose();
        }}
        title={`Nhắn tin cho ${user.basic_info.username}`}
        actions={[
          {
            className: 'btn-common-primary',
            onClick: () => {
              onClose();
            },
            content: (
              <div
                className='send-sell-message'
                onClick={() => {
                  const { message } = this.state;
                  if (message) {
                    this.handleSendSellMessage({
                      content: message,
                      files: [],
                    });
                  }
                }}
              >
                <i className='fab fa-facebook-messenger'></i>
                {` Gửi tin nhắn`}
              </div>
            ),
          },
        ]}
      >
        <div className='sell-messenger-body'>
          <div className='listing-brief-info'>
            <div className='brief-picture'>
              <img src={files[0].path} alt='' />
            </div>

            <div className='brief-info'>
              <div className='bi-title'>
                {title ? title : make ? `${make} ${model} ${year}` : homeType}
              </div>
              <div className='bi-price'>
                {price && numberToMoney(price.toString())}
              </div>
            </div>
          </div>
          <div className='suggest-question'>
            {questionArr &&
              questionArr.map((each, i) => (
                <div
                  className='each-question'
                  key={i}
                  onClick={() => this.handleMessageChange(each)}
                >
                  <span>{each}</span>
                </div>
              ))}
          </div>
          <div className='direct-chat'>
            <ListingInfoInput
              label={'Vui lòng nhập tin nhắn cho người bán'}
              textArea={true}
              id={'sell-direct-chat'}
              value={message}
              onChange={(e) => this.handleMessageChange(e.target.value)}
            />
          </div>
        </div>
      </CommonModalLayout>
    );
  }
}
