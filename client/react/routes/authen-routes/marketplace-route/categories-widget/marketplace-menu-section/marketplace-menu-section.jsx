import React, { Component } from 'react';
import { MenuNavigationWithIcon } from '../../../../../common/menu-navigation-with-icon/menu-navigation-with-icon';
import { CategoriesSection } from './categories-section/categories-section';
import { customHistory } from '../../../../routes';

export class MarketplaceMenuSection extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  menuNavigation = [
    {
      icon: <i className='fas fa-store'></i>,
      title: 'Lướt xem tất cả',
      type: 'main',
    },
    {
      icon: <i className='fas fa-tags'></i>,
      title: 'Đang bán',
    },
    {
      icon: <i className='fas fa-user'></i>,
      title: 'Tài khoản của bạn',
    },
  ];
  render() {
    return (
      <div className='marketplace-menu-section'>
        {this.menuNavigation.map((each) => (
          <MenuNavigationWithIcon
            key={each.title}
            icon={each.icon}
            title={each.title}
            type={each.type}
          />
        ))}
        <div
          className='create-listing-button'
          onClick={() => customHistory.push('/marketplace/create')}
        >
          <i className='fas fa-plus'></i>
          <div className='create-lb-title-wrapper'>
            <span className='create-lb-title'>Tạo bài niêm yết mới</span>
          </div>
        </div>
        <div className='line-seperate'></div>
        {/* <CategoriesSection darkMode={darkMode} /> */}
      </div>
    );
  }
}
