import React, { Component } from 'react';
import { KComponent } from '../../../../../common/k-component';
import { CommonLayout } from '../../../../../layout/common-layout/common-layout';
import { PageTitle } from '../../../../../common/page-title/page-title';
import { CreateListingInputWidget } from './create-listing-input-widget/create-listing-input-widget';

class CreateListingDetail extends KComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className='create-listing-detail'>
        <PageTitle title={'Tạo niêm yết'}>
          <CommonLayout
            // className={}
            mainRender={() => <div>xem truoc</div>}
            haveRightRender={false}
            leftRender={() => <CreateListingInputWidget {...this.props} />}
          />
        </PageTitle>
      </div>
    );
  }
}

export default CreateListingDetail;
