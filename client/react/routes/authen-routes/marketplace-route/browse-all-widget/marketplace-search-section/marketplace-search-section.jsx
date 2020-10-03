import React, { Component } from 'react';
import { categoryApi } from '../../../../../../api/common/category-api';
import { MarketplaceSearch } from './marketplace-search/marketplace-search';

export class MarketplaceSearchSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mainCategoryInfo: '',
    };
  }
  componentDidUpdate(prevProps) {
    if (prevProps.mainID !== this.props.mainID) {
      this.getCategoryInfo();
    }
  }

  componentDidMount() {
    this.getCategoryInfo();
  }

  getCategoryInfo = () => {
    this.props.mainID &&
      categoryApi
        .getCategoryByID(this.props.mainID)
        .then((e) => this.setState({ mainCategoryInfo: e }));
  };
  render() {
    const { mainCategoryInfo } = this.state;
    return (
      <div className='market-search-section'>
        <h1 className='market-search-title'>
          {mainCategoryInfo.name || 'Marketplace'}
        </h1>
        <MarketplaceSearch />
        <div className='line-seperate'></div>
      </div>
    );
  }
}
