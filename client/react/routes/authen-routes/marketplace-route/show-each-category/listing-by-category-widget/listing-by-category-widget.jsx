import React, { Component } from 'react';
import { listingApi } from './../../../../../../api/common/listing-api';
import { ListingDisplay } from './../../all-listing-widget/listing-display/listing-display';
import { insideCircle } from 'geolocation-utils';
import { KComponent } from './../../../../../common/k-component';

export class ListingByCategoryWidget extends KComponent {
  constructor(props) {
    super(props);
    this.state = {
      listingByCategory: {
        listingArr: [],
      },
    };
  }
  componentDidMount() {
    this.getListing();
  }
  componentDidUpdate(prevProps) {
    if (
      prevProps.match.params.categoryID !== this.props.match.params.categoryID
    ) {
      this.getListing();
    }
  }
  getListing = () => {
    listingApi
      .getListingByCategoryID(this.props.match.params.categoryID)
      .then((e) => this.setState({ listingByCategory: e }));
  };
  render() {
    const { listingByCategory } = this.state;
    const { radius, myPosition } = this.props;
    return (
      <div className='listing-by-category-widget'>
        {!!listingByCategory.listingArr.length ? (
          <div className='listing-by-category-wrapper'>
            <div className='listing-suitable'>
              {listingByCategory.listingArr.map((listing) => {
                return (
                  insideCircle(listing.position, myPosition, radius * 1000) && (
                    <ListingDisplay listing={listing} key={listing._id} />
                  )
                );
              })}
            </div>
            <div className='listing-outside-search'></div>
          </div>
        ) : (
          <div className='category-empty-listing'>
            <div className='empty-icon'>
              <img
                src={
                  'https://localhost:2000/assets/images/icons/empty-listing.jpg'
                }
                alt=''
              />
            </div>
            <div className='empty-message'>
              Hiện không có sản phẩm nào trong khu vực của bạn. Hãy kiểm tra lại
              sau.
            </div>
          </div>
        )}
      </div>
    );
  }
}
