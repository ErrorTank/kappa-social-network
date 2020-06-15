import React, { Component } from 'react';
import { KComponent } from '../../../../common/k-component';
import { CommonLayout } from '../../../../layout/common-layout/common-layout';
import { CreateListingWidget } from './create-listing-widget/create-listing-widget';
import { PageTitle } from '../../../../common/page-title/page-title';
import { PickListingTypeWidget } from './pick-listing-type-widget/pick-listing-type-widget';

class MarketplaceCreateListing extends KComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className='marketplace-create-listing'>
        <PageTitle title={'Tạo niêm yết'}>
          <CommonLayout
            mainRender={() => <PickListingTypeWidget />}
            haveRightRender={false}
            leftRender={() => <CreateListingWidget />}
          />
        </PageTitle>
      </div>
    );
  }
}

export default MarketplaceCreateListing;
