import React, { Component } from 'react';
import { MenuNavigationWithIcon } from '../../../../../common/menu-navigation-with-icon/menu-navigation-with-icon';

export class MarketplaceMenuSection extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className='marketplace-menu-section'>
        <MenuNavigationWithIcon
          // icon={<i className='fas fa-store'></i>}
          title={'Lướt xem tất cả'}
          icon={
            <span className='fa-stack fa-2x'>
              <i className='fa fa-circle fa-stack-2x'></i>
              <i className='fa fas fa-store fa-stack-1x fa-inverse'></i>
            </span>
          }
        />
        {/* <MenuNavigationWithIcon
          icon={<i className='fas fa-store'></i>}
          title={'Tài khoản của bạn'}
        /> */}
      </div>
    );
  }
}
