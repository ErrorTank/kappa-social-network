import React, { Component } from 'react';
import { modals } from './../modals';
import { CommonModalLayout } from './../common-modal-layout';
import { numberToMoney } from '../../../../common/utils/listing-utils';
import { ListingInfoInput } from './../../listing-info-input/listing-info-input';

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
    this.setQuestionArr();
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

  setQuestionArr = () => {
    let { onClose, listing } = this.props;
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
    console.log(listing);

    this.suggestQuestion.map((e) => {
      if (title && e.type === 'item') {
        this.setState({ questionArr: e.question });
      }
      if (homeType && e.type === 'rent') {
        this.setState({ questionArr: e.question });
      }
    });
  };
  render() {
    let { onClose, listing } = this.props;
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
    const { message, questionArr } = this.state;
    console.log(questionArr);
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
              <>
                <i className='fab fa-facebook-messenger'></i>
                Gửi tin nhắn
              </>
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
            <div className='question-wrapper'>
              {questionArr &&
                questionArr.map((each, i) => (
                  <div className='each-question' key={i}>
                    <span>{each}</span>
                  </div>
                ))}
            </div>
          </div>
          <div className='direct-chat'>
            <ListingInfoInput
              label={'Vui lòng nhập tin nhắn cho người bán'}
              textArea={true}
              id={'sell-direct-chat'}
              value={this.state.message}
              onChange={(e) => {
                this.setState({ message: e });
              }}
            />
          </div>
        </div>
      </CommonModalLayout>
    );
  }
}
