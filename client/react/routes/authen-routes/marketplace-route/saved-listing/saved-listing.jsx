import React, { Component } from 'react';
import { CommonLayout } from '../../../../layout/common-layout/common-layout';
import { PageTitle } from '../../../../common/page-title/page-title';
import { YourSavedListing } from './your-saved-listing/your-saved-listing';
import { BrowseAllWidget } from './../browse-all-widget/browse-all-widget';

class SavedListing extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className='saved-listing'>
        <PageTitle title={'Saved Listing'}>
          <div className='saved-listing'>
            <CommonLayout
              mainRender={() => <YourSavedListing />}
              haveRightRender={false}
              leftRender={() => <BrowseAllWidget />}
            />
          </div>
        </PageTitle>
      </div>
    );
  }
}

export default SavedListing;
