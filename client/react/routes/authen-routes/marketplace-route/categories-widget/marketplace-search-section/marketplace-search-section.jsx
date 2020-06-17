import React, { Component } from 'react';
import { MarketplaceSearch } from './marketplace-search/marketplace-search';
import { MarketplaceHeader } from './marketplace-header/marketplace-header';

export class MarketplaceSearchSection extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className='market-search-section'>
        <MarketplaceHeader />
        <MarketplaceSearch />
        <div className='line-seperate'></div>
      </div>
    );
  }
}
