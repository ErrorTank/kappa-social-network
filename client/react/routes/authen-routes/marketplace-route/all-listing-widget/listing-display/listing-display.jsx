import React, { Component } from 'react';
import classnames from 'classnames';
import { getBase64Image } from '../../../../../../common/utils/file-upload-utils';

export class ListingDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { listing } = this.props;
    console.log(listing, 'sdfas');
    return (
      <div className='listing-display'>
        <div className='listing-picture'>
          <img src={listing.files[0].path} alt='' />
        </div>
        <div className='lisiting-main-info'>
          {listing.title}
          {listing.price}
        </div>
      </div>
    );
  }
}
