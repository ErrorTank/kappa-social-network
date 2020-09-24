import React, { Component } from 'react';
import { MarketplaceSearchSection } from './../../browse-all-widget/marketplace-search-section/marketplace-search-section';
import { ThemeContext } from './../../../../../context/theme-context';

export class CategoryTraitWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    console.log(this.props);
    return (
      <ThemeContext.Consumer>
        {({ darkMode }) => (
          <div className='category-trait-widget'>
            <MarketplaceSearchSection darkMode={darkMode} title={''} />
            {/* <div className='browse-all-body'>
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
                  console.log(each.link);
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
        </div> */}
          </div>
        )}
      </ThemeContext.Consumer>
    );
  }
}
