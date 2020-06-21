import React, { Component } from 'react';

import { TypeShowcase } from './type-showcase/type-showcase';

export class PickListingTypeWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  listingType = [
    {
      url: '/marketplace/create/item',
      icon: <i className='fad fa-cart-plus'></i>,
      title: 'Mặt hàng để bán',
      description: 'Bán một mặt hàng trong một hạng mục duy nhất.',
      className: 'item',
    },
    {
      url: '/marketplace/create/vehicle',
      icon: <i className='fad fa-cars'></i>,
      title: 'Phương tiện để bán',
      description: 'Bán xe hơi, xe tải hoặc loại xe khác.',
      className: 'vehicle',
    },
    {
      url: '/marketplace/create/rental',
      icon: <i className='fad fa-home'></i>,
      title: 'Nhà bán/cho thuê',
      description: 'Đăng bán ngôi nhà hoặc căn hộ cho thuê.',
      className: 'house',
    },
  ];
  render() {
    return (
      <div className='pick-listing-type-widget'>
        <div className='pick-listing-title-wrapper'>
          <span className='pick-listing-title'>Chọn loại bài niêm yết</span>
        </div>
        <div className='pick-listing-type-wrapper'>
          {this.listingType.map((each, i) => {
            return (
              <TypeShowcase
                key={each.url}
                url={each.url}
                icon={each.icon}
                title={each.title}
                description={each.description}
                className={each.className}
              />
            );
          })}
        </div>
      </div>
    );
  }
}
