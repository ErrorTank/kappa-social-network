import React, { Component } from 'react';
import { MarketplaceSearch } from './marketplace-search/marketplace-search';

export class MarketplaceSearchSection extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    let { title } = this.props;
    return (
      <div className='market-search-section'>
        <h1 className='market-search-title'>{title}</h1>
        <MarketplaceSearch />
        <div className='line-seperate'></div>
      </div>
    );
  }
}
