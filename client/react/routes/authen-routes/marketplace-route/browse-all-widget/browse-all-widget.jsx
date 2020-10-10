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

export class BrowseAllWidget extends KComponent {
  constructor(props) {
    super(props);
    this.state = {
      categoryDisplay: [],
    };

    categoryApi.getCategory({}).then((categories) => {
      this.setState({ categoryDisplay: getCategoriesNavigation(categories) });
    });
  }

  browseAllMenu = [
    {
      icon: 'fas fa-store',
      title: 'Lướt xem tất cả',
      type: 'main',
      link: '/marketplace',
    },
    {
      icon: 'fas fa-tags',
      title: 'Đang bán',
      link: '/marketplace/you/selling',
    },
    {
      icon: 'fas fa-user',
      title: 'Tài khoản của bạn',
      link: '/marketplace/you',
    },
  ];

  render() {
    const { categoryDisplay } = this.state;
    const { updateValue, radius } = this.props;
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
              <MarketplaceFilterSection radius={radius}>
                <ListingInfoSelect
                  label={'Bán kính'}
                  options={radiusArr}
                  displayAs={(item) => item.value + ' km'}
                  value={{ value: radius }}
                  isSelected={(option) => option.value === radius}
                  onChange={(e) => {
                    updateValue(`radius`, e.value);
                  }}
                />
              </MarketplaceFilterSection>
              <CategoriesSection
                darkMode={darkMode}
                categoryDisplay={this.state.categoryDisplay}
              />
            </div>
          </div>
        )}
      </ThemeContext.Consumer>
    );
  }
}
