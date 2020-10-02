import React, { Component } from 'react';
import { listingApi } from './../../../../../../api/common/listing-api';
import { ListingDisplay } from './../../all-listing-widget/listing-display/listing-display';

export class ListingByCategoryWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listingByCategory: {
        listingArr: [],
      },
    };
    listingApi
      .getListingByCategoryID(this.props.match.params.categoryID)
      .then((e) => this.setState({ listingByCategory: e }));
  }
  render() {
    const { listingByCategory } = this.state;
    console.log(listingByCategory);
    return (
      <div className='listing-by-category-widget'>
        {!!listingByCategory.listingArr.length ? (
          listingByCategory.listingArr.map((listing) => (
            <ListingDisplay listing={listing} key={listing._id} />
          ))
        ) : (
          <div className='category-empty-listing'>Khong</div>
        )}
      </div>
    );
  }
}
