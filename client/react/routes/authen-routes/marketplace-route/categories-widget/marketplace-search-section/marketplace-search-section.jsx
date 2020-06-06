import React, { Component } from 'react';
import { MarketSearch } from './market-search/market-search';

export class MarketplaceSearchSection extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className='market-search-section'>
        <h1 className='market-search-title'>Marketplace</h1>
        <MarketSearch />
      </div>
    );
  }
}
