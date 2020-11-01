import React, { Component } from 'react';
import { listingApi } from './../../../../../api/common/listing-api';
import { PageTitle } from './../../../../common/page-title/page-title';
import { ImageSlider } from './../marketplace-create-listing/create-listing-detail/cl-preview-widget/image-slider/image-slider';

class ListingFullDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listing: {
        files: {},
      },
    };
    listingApi
      .getListingByListingID(this.props.match.params.listingID)
      .then((e) => this.setState({ listing: e }));
  }
  render() {
    const { listing } = this.state;
    return (
      <PageTitle title={'Listing'}>
        <div className='listing-full-display'>
          <div className='picture-display-section'>
            <ImageSlider files={listing.files} />
          </div>
          <div className='listing-all-info-section'></div>
          <div className='blank-section'></div>
        </div>
      </PageTitle>
    );
  }
}

export default ListingFullDisplay;
