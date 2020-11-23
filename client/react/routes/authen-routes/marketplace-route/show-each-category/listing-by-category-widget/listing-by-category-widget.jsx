import React, { Component } from 'react';
import { listingApi } from './../../../../../../api/common/listing-api';
import { ListingDisplay } from './../../all-listing-widget/listing-display/listing-display';
import { insideCircle } from 'geolocation-utils';
import { KComponent } from './../../../../../common/k-component';

export class ListingByCategoryWidget extends KComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { radius, myPosition, listingByCategory } = this.props;
    return (
      <div className='listing-by-category-widget'>
        {listingByCategory && !!listingByCategory.listingArr.length ? (
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
            <div className='listing-outside-search'>
              <div className='outside-search-header'>
                Kết quả ngoài phạm vi bạn tìm kiếm
              </div>
              <div className='outside-search-wrapper'>
                {listingByCategory.listingArr.map((listing) => {
                  return (
                    !insideCircle(
                      listing.position,
                      myPosition,
                      radius * 1000
                    ) && <ListingDisplay listing={listing} key={listing._id} />
                  );
                })}
              </div>
            </div>
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
