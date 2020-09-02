import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { ThemeContext } from '../../../../context/theme-context';
import { MarketplaceSearchSection } from './marketplace-search-section/marketplace-search-section';
import { MarketplaceMenuSection } from './marketplace-menu-section/marketplace-menu-section';
import { CategoriesSection } from './categories-section/categories-section';
import { MarketplaceFilterSection } from './marketplace-filter-section/marketplace-filter-section';

export class BrowseAllWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  browseAllMenu = [
    {
      icon: <i className='fas fa-store'></i>,
      title: 'Lướt xem tất cả',
      type: 'main',
      link: '/marketplace',
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
      <ThemeContext.Consumer>
        {({ darkMode }) => (
          <div className={classnames('browse-all-widget', { darkMode })}>
            <MarketplaceSearchSection darkMode={darkMode} />
            <MarketplaceMenuSection
              darkMode={darkMode}
              menuNavigation={this.browseAllMenu}
            />
            <MarketplaceFilterSection />
            <div className='line-seperate'></div>
            <CategoriesSection darkMode={darkMode} />
          </div>
        )}
      </ThemeContext.Consumer>
    );
  }
}
