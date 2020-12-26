import React, { Component } from 'react';
import { listingApi } from '../../../../../../api/common/listing-api';
import { userInfo } from './../../../../../../common/states/common';
import { ListingDisplay } from './../../all-listing-widget/listing-display/listing-display';

export class YourSavedListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      savedListingArr: [],
    };
    listingApi
      .getSavedListing(userInfo.getState()._id)
      .then((e) => this.setState({ savedListingArr: e }));
  }
  render() {
    const { savedListingArr } = this.state;
    return (
      <div className='your-saved-listing'>
        {!!savedListingArr.length ? (
          savedListingArr.map((e) => {
            return (
              <div className='saved-listing-wrapper'>
                <ListingDisplay listing={e} key={e._id} />
              </div>
            );
          })
        ) : (
          <div className='saved-listing-empty-wrapper'>
            <div className='saved-listing-empty'>
              <div className='empty-icon'>
                <img
                  src={
                    'https://localhost:2000/assets/images/icons/bookmark.png'
                  }
                  alt=''
                />
              </div>
              <div className='empty-message'>
                Hiện bạn không lưu sản phẩm nào. Hãy kiểm tra lại sau.
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
