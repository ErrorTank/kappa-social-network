import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { ThemeContext } from '../../../../context/theme-context';
import { MarketplaceSearchSection } from '../categories-widget/marketplace-search-section/marketplace-search-section';
import { MarketplaceMenuSection } from '../categories-widget/marketplace-menu-section/marketplace-menu-section';

export class CategoriesWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <ThemeContext.Consumer>
        {({ darkMode }) => (
          <div className={classnames('categories-widget', { darkMode })}>
            <MarketplaceSearchSection darkMode={darkMode} />
            <MarketplaceMenuSection darkMode={darkMode} />
          </div>
        )}
      </ThemeContext.Consumer>
    );
  }
}
