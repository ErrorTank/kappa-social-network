import React, { Component } from 'react';
import { MarketplaceSearchSection } from './../../browse-all-widget/marketplace-search-section/marketplace-search-section';
import { ThemeContext } from './../../../../../context/theme-context';
import { categoryApi } from './../../../../../../api/common/category-api';
import { MarketplaceMenuSection } from './../../browse-all-widget/marketplace-menu-section/marketplace-menu-section';
import { MarketplaceFilterSection } from '../../browse-all-widget/marketplace-filter-section/marketplace-filter-section';
import { CategoriesSection } from './../../browse-all-widget/categories-section/categories-section';
import { getCategoriesNavigation } from '../../../../../../common/utils/listing-utils';

export class CategoryTraitWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryDisplay: [],
    };

    categoryApi.getCategory({}).then((categories) => {
      this.setState({ categoryDisplay: getCategoriesNavigation(categories) });
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
    const { radius, updateValue, handleState, state } = this.props;
    const { categoryDisplay } = this.state;
    // console.log(this.props);

    return (
      <ThemeContext.Consumer>
        {({ darkMode }) => (
          <div className='category-trait-widget'>
            <MarketplaceSearchSection
              darkMode={darkMode}
              mainID={this.props.match.params.categoryID}
            />
            <div className='category-trait-body'>
              <MarketplaceMenuSection darkMode={darkMode} />
              <MarketplaceFilterSection
                radius={radius}
                updateValue={updateValue}
                handleState={handleState}
                state={state}
                isFilter={true}
              />
              <CategoriesSection
                darkMode={darkMode}
                categoryDisplay={categoryDisplay}
                mainID={this.props.match.params.categoryID}
              />
            </div>
          </div>
        )}
      </ThemeContext.Consumer>
    );
  }
}
