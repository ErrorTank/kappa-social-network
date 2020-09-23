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
import { MenuNavigationWithIcon } from './../../../../common/menu-navigation-with-icon/menu-navigation-with-icon';
import { ListingInfoSelect } from './../../../../common/listing-info-select/listing-info-select';

export class BrowseAllWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryDisplay: [],
    };

    categoryApi.getCategory({}).then((categories) => {
      let itemInfo = itemField.find((e) => e.englishName === 'category');
      let itemIcon = itemInfo.options.filter((e) => e.icon);
      let additionInfo = [...itemIcon, ...this.otherCategory];

      let categoryWithIcon = categories.reduce((res, option) => {
        let checkIcon = additionInfo.find((each) => each.name === option.name);
        if (checkIcon) {
          return [
            ...res,
            {
              ...option,
              icon: checkIcon.icon,
              link: `/marketplace/${checkIcon.name}`,
            },
          ];
        } else {
          return res;
        }
      }, []);

      this.setState({ categoryDisplay: categoryWithIcon });
    });
  }

  otherCategory = [
    { icon: 'fas fa-home', name: 'Bán nhà' },
    {
      icon: 'far fa-home-alt',
      name: 'Cho thuê',
    },
  ];

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
  radiusArr = [
    {
      value: 1,
    },
    {
      value: 2,
    },
    {
      value: 5,
    },
    {
      value: 10,
    },
    {
      value: 20,
    },
    {
      value: 40,
    },
    {
      value: 60,
    },
    {
      value: 1000,
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
                  options={this.radiusArr}
                  displayAs={(item) => item.value + ' km'}
                  value={{ value: radius }}
                  isSelected={(option) => option.value === radius}
                  onChange={(e) => {
                    updateValue(`radius`, e.value);
                  }}
                />
              </MarketplaceFilterSection>
              <CategoriesSection darkMode={darkMode}>
                <>
                  {categoryDisplay &&
                    categoryDisplay.map((each) => {
                      return (
                        <MenuNavigationWithIcon
                          key={each.name}
                          icon={each.icon}
                          title={each.name}
                          type={each.type}
                          onClick={() => customHistory.push(each.link)}
                          // options={each.children}
                        />
                      );
                    })}
                </>
              </CategoriesSection>
            </div>
          </div>
        )}
      </ThemeContext.Consumer>
    );
  }
}
