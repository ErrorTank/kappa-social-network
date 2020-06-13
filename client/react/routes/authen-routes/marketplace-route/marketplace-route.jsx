import React, { Component } from 'react';
import { PageTitle } from '../../../common/page-title/page-title';
import { KComponent } from '../../../common/k-component';
import { CommonLayout } from '../../../layout/common-layout/common-layout';
import { CategoriesWidget } from './categories-widget/categories-widget';

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
            mainRender={() => <div>hello</div>}
            haveRightRender={false}
            leftRender={() => <CategoriesWidget />}
          />
        </div>
      </PageTitle>
    );
  }
}
export default MarketplaceRoute;
