import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { ThemeContext } from '../../../../context/theme-context';
import { MarketplaceSearchSection } from './marketplace-search-section/marketplace-search-section';
import { MarketplaceMenuSection } from './marketplace-menu-section/marketplace-menu-section';
import { CategoriesSection } from './categories-section/categories-section';
import { MarketplaceFilterSection } from './marketplace-filter-section/marketplace-filter-section';
import { categoryApi } from './../../../../../api/common/category-api';
import { itemField, radiusArr } from './../../../../../const/listing';
import { ListingInfoSelect } from './../../../../common/listing-info-select/listing-info-select';
import { KComponent } from './../../../../common/k-component';
import { getCategoriesNavigation } from '../../../../../common/utils/listing-utils';
import { customHistory } from '../../../routes';
import { marketplaceInfo } from './../../../../../common/states/common';

export class BrowseAllWidget extends KComponent {
  constructor(props) {
    super(props);
    this.state = {
      categoryDisplay: [],
    };

    categoryApi.getCategory({}).then((categories) => {
      this.setState({ categoryDisplay: getCategoriesNavigation(categories) });
    });

    this.onUnmount(
      marketplaceInfo.onChange((newState, oldState) => {
        if (newState.radius !== oldState.radius) this.forceUpdate();
      })
    );
  }

  updateValue = (key, val) => {
    let oldState = marketplaceInfo.getState();
    localStorage.setItem([key], val);
    marketplaceInfo.setState({ ...oldState, [key]: val });
  };

  browseAllMenu = [
    {
      icon: <i className='fas fa-store'></i>,
      title: 'Lướt xem tất cả',
      link: '/marketplace',
    },
    {
      icon: <i className='fas fa-tags'></i>,
      title: 'Bài niêm yết của bạn',
      link: '/marketplace/you/selling',
    },
    {
      icon: <i className='fas fa-bookmark'></i>,
      title: 'Đã lưu',
      link: '/marketplace/you/saved',
    },
  ];

  render() {
    const { categoryDisplay } = this.state;
    let info = marketplaceInfo.getState();
    const { radius } = info;
    // const { updateValue } = this.props;
    // console.log(marketplaceInfo.getState().radius);
    // console.log(localStorage.getItem('radius'));
    return (
      <ThemeContext.Consumer>
        {({ darkMode }) => (
          <div className={classnames('browse-all-widget', { darkMode })}>
            <MarketplaceSearchSection darkMode={darkMode} />
            <div className='browse-all-body'>
              <MarketplaceMenuSection
                darkMode={darkMode}
                menuNavigation={this.browseAllMenu}
              />
              <MarketplaceFilterSection
                radius={radius || localStorage.getItem('radius')}
                updateValue={this.updateValue}
              />
              <CategoriesSection
                darkMode={darkMode}
                categoryDisplay={categoryDisplay}
              />
            </div>
          </div>
        )}
      </ThemeContext.Consumer>
    );
  }
}
