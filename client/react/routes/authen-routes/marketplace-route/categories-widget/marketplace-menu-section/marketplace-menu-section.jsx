import React, { Component } from 'react';
import { MenuNavigationWithIcon } from '../../../../../common/menu-navigation-with-icon/menu-navigation-with-icon';
import { CategoriesSection } from './categories-section/categories-section';
import { LineSeperate } from '../../../../../common/line-seperate/line-seperate';

export class MarketplaceMenuSection extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className='marketplace-menu-section'>
        <MenuNavigationWithIcon
          icon={<i className='fas fa-store'></i>}
          title={'Lướt xem tất cả'}
        />
        <MenuNavigationWithIcon
          icon={<i className='fas fa-user'></i>}
          title={'Tài khoản của bạn'}
        />
        <div className='create-listing-button'>
          <i className='fas fa-plus'></i>
          <div className='create-lb-title-wrapper'>
            <span className='create-lb-title'>Tạo bài niêm yết mới</span>
          </div>
        </div>
        <LineSeperate />
        {/* <CategoriesSection darkMode={darkMode} /> */}
      </div>
    );
  }
}
