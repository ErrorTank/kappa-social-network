import React, { Component } from 'react';
import { numberToMoney } from '../../../../../../common/utils/listing-utils';
import { listingApi } from './../../../../../../api/common/listing-api';

export class YourListing extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    listingApi
      .getListingByUserID(this.props.user._id)
      .then((e) => this.setState({ sellingList: e }));
  }
  render() {
    const { sellingList } = this.state;
    console.log(sellingList);
    return (
      <div className='your-listing'>
        <div className='sold-listing-wrapper'>
          <div className='sold-listing-header'>
            <span>Đã bán</span>
          </div>
          {sellingList &&
            sellingList.map((e) => (
              <div className='sold-listing' key={e._id}>
                <div className='sl-info'>
                  <div className='sl-picture'>
                    <img src={e.files[0].path} alt='' />
                  </div>
                  <div className='sl-display-info'>
                    <div className='sl-basic-info'>
                      <div className='sl-title'>
                        {e.title ? e.title : `${e.make} ${e.model} ${e.year}`}
                      </div>
                      <div className='sl-price'>
                        {numberToMoney(e.price.toString())}
                      </div>
                    </div>
                    <div className='sl-addition-info'>
                      Đã niêm yết trên Marketplace
                    </div>
                  </div>
                </div>
                <div className='sl-funtion'></div>
              </div>
            ))}
        </div>
      </div>
    );
  }
}
