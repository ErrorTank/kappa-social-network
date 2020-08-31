import React, { Component } from 'react';
import { PageTitle } from '../../../common/page-title/page-title';
import { KComponent } from '../../../common/k-component';
import { CommonLayout } from '../../../layout/common-layout/common-layout';
import { BrowseAllWidget } from './browse-all-widget/browse-all-widget';
import { AllListingWidget } from './all-listing-widget/all-listing-widget';

class MarketplaceRoute extends KComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <PageTitle title={'Marketplace'}>
        <div className='marketplace-route'>
          <CommonLayout
            mainRender={() => <AllListingWidget />}
            haveRightRender={false}
            leftRender={() => <BrowseAllWidget />}
          />
        </div>
      </PageTitle>
    );
  }
}
export default MarketplaceRoute;
