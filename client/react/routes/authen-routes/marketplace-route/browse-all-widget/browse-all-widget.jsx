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
import { MenuNavigationWithIcon } from './../../../../common/menu-navigation-with-icon/menu-navigation-with-icon';

export class BrowseAllWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryDisplay: [],
    };
    categoryApi.getCategory({}).then((e) => {
      let itemInfo = itemField.find((e) => e.englishName === 'category');
      let itemIcon = itemInfo.options.filter((e) => e.icon);
      // console.log(itemIcon);
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
      // console.log(categoryWithIcon);
      let categoryDisplay = categoryWithIcon.reduce((res, option) => {
        if (option.icon) {
          res.push({
            title: option.name,
            icon: option.icon,
          });
        }
        return res;
      }, []);
      let otherCategory = [
        { icon: 'fas fa-home', title: 'Bán nhà' },
        {
          icon: 'fas fa-house',
          title: 'Cho thuê',
        },
      ];
      let final = [...categoryDisplay, ...otherCategory];
      // console.log(final);
      // console.log(categoryDisplay);
      this.setState({ categoryDisplay: final });
      // console.log(e);
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
    },
    {
      icon: 'fas fa-user',
      title: 'Tài khoản của bạn',
    },
  ];
  render() {
    const { categoryDisplay } = this.state;
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
            <CategoriesSection darkMode={darkMode}>
              <>
                {categoryDisplay &&
                  categoryDisplay.map((each) => {
                    return (
                      <MenuNavigationWithIcon
                        key={each.title}
                        icon={each.icon}
                        title={each.title}
                        type={each.type}
                        onClick={() => customHistory.push(each.link)}
                      />
                    );
                  })}
              </>
            </CategoriesSection>
          </div>
        )}
      </ThemeContext.Consumer>
    );
  }
}
