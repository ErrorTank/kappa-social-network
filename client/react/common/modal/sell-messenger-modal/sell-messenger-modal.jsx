import React, { Component } from 'react';
import { modals } from './../modals';
import { CommonModalLayout } from './../common-modal-layout';
import { numberToMoney } from '../../../../common/utils/listing-utils';

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
  }

  suggestQuestion = [
    {
      type: 'item',
      question: [
        'Tôi quan tâm đến mặt hàng này.',
        'Mặt hàng này còn chứ',
        'Mặt hàng ở tình trạng như thế nào?',
        'Bạn có giao hàng không?',
      ],
    },
  ];
  render() {
    let { onClose, listing } = this.props;
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
    console.log(listing);
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
            {this.suggestQuestion.map((e) => {
              return (
                title &&
                e.type === 'item' &&
                e.question.map((each) => (
                  <div className='each-question'>
                    <span>{each}</span>
                  </div>
                ))
              );
            })}
          </div>
          <div className='direct-chat'></div>
        </div>
      </CommonModalLayout>
    );
  }
}
