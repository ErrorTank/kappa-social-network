import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { ThemeContext } from '../../../../context/theme-context';
import { MarketplaceSearchSection } from './marketplace-search-section/marketplace-search-section';
import { MarketplaceMenuSection } from './marketplace-menu-section/marketplace-menu-section';
import { CategoriesSection } from './categories-section/categories-section';
import { MarketplaceFilterSection } from './marketplace-filter-section/marketplace-filter-section';
import { categoryApi } from './../../../../../api/common/category-api';
import { itemField } from './../../../../../const/listing';
import category from '../../../../../../server/db/model/marketplace/category';

export class BrowseAllWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryDisplay: [],
    };
    categoryApi.getCategory({}).then((e) => {
      let itemInfo = itemField.find((e) => e.englishName === 'category');
      let itemIcon = itemInfo.options.filter((e) => e.icon);
      let categoryWithIcon = e.map((category) => {
        let checkIcon = itemIcon.find((e) => e.name === category.name);
        if (checkIcon && checkIcon.icon) {
          return {
            ...category,
            icon: checkIcon.icon,
          };
        } else {
          return category;
        }
      });
      // should use reduce to map and filter to get icon only maybe
      console.log(categoryWithIcon);
      let categoryDisplay = categoryWithIcon.reduce((res, option) => {
        if (option.icon) {
          res.push({
            title: option.name,
            icon: option.icon,
          });
        }
        return res;
      }, []);
      // console.log(categoryDisplay);
      this.setState({ categoryDisplay });
      // console.log(e);
    });
  }
  // browseAllCategory = []

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
    },
    {
      icon: 'fas fa-user',
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
            <CategoriesSection
              darkMode={darkMode}
              categoryDisplay={this.state.categoryDisplay}
            />
          </div>
        )}
      </ThemeContext.Consumer>
    );
  }
}
