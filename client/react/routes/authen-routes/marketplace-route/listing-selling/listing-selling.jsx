import React, { Component } from 'react';
import { KComponent } from '../../../../common/k-component';
import { CommonLayout } from '../../../../layout/common-layout/common-layout';
import { PageTitle } from '../../../../common/page-title/page-title';
import { BrowseAllWidget } from './../browse-all-widget/browse-all-widget';

class ListingSelling extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <PageTitle title={'Listing Selling'}>
        <div className='listing-selling'>
          <CommonLayout
            mainRender={() => <div>ok</div>}
            haveRightRender={false}
            leftRender={() => <BrowseAllWidget />}
          />
        </div>
      </PageTitle>
    );
  }
}

export default ListingSelling;
