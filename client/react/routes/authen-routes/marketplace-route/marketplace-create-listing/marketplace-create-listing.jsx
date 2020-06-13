import React, { Component } from 'react';
import { KComponent } from '../../../../common/k-component';
import { CommonLayout } from '../../../../layout/common-layout/common-layout';
import { CreateListingWidget } from './create-listing-widget/create-listing-widget';

class MarketplaceCreateListing extends KComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className='marketplace-create-listing'>
        <CommonLayout
          mainRender={() => <div>hello</div>}
          haveRightRender={false}
          leftRender={() => <CreateListingWidget />}
        />
      </div>
    );
  }
}

export default MarketplaceCreateListing;
