import React, { Component } from 'react';
import { listingApi } from './../../../../../api/common/listing-api';
import { PageTitle } from './../../../../common/page-title/page-title';

class ListingFullDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    listingApi
      .getListingByListingID(this.props.match.params.listingID)
      .then((e) => console.log(e));
  }
  render() {
    return (
      <PageTitle title={'Listing'}>
        <div className='listing-full-display'></div>
      </PageTitle>
    );
  }
}

export default ListingFullDisplay;
