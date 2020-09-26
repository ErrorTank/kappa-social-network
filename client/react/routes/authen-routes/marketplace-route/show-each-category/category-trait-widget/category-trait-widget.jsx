import React, { Component } from 'react';
import { MarketplaceSearchSection } from './../../browse-all-widget/marketplace-search-section/marketplace-search-section';
import { ThemeContext } from './../../../../../context/theme-context';
import { categoryApi } from './../../../../../../api/common/category-api';
import { radiusArr } from './../../../../../../const/listing';
import { MarketplaceMenuSection } from './../../browse-all-widget/marketplace-menu-section/marketplace-menu-section';
import { MarketplaceFilterSection } from '../../browse-all-widget/marketplace-filter-section/marketplace-filter-section';
import { ListingInfoSelect } from './../../../../../common/listing-info-select/listing-info-select';
import { CategoriesSection } from './../../browse-all-widget/categories-section/categories-section';
import { MenuNavigationWithIcon } from './../../../../../common/menu-navigation-with-icon/menu-navigation-with-icon';

export class CategoryTraitWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    // listingApi
    //   .getListingByCategoryID(this.props.match.params.categoryID)
    //   .then((e) => this.setState({}));
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
              link: `/marketplace/${option._id}`,
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

  render() {
    // console.log(this.props);
    const { radius, updateValue } = this.props;
    const { categoryDisplay } = this.state;
    return (
      <ThemeContext.Consumer>
        {({ darkMode }) => (
          <div className='category-trait-widget'>
            <MarketplaceSearchSection darkMode={darkMode} title={'Test'} />
            <div className='category-trait-body'>
              <MarketplaceMenuSection darkMode={darkMode} />
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
