import React, { Component } from 'react';
import { MenuNavigationWithIcon } from '../../../../../common/menu-navigation-with-icon/menu-navigation-with-icon';
import { customHistory } from '../../../../routes';

export class MarketplaceMenuSection extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className='marketplace-menu-section'>
        {this.props.menuNavigation.map((each) => (
          <MenuNavigationWithIcon
            key={each.title}
            icon={each.icon}
            title={each.title}
            type={each.type}
            onClick={() => customHistory.push(each.link)}
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
      </div>
    );
  }
}
