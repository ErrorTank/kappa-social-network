import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { ThemeContext } from '../../../../context/theme-context';
import { listingApi } from './../../../../../api/common/listing-api';
import { ListingDisplay } from './listing-display/listing-display';

export class AllListingWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allListing: [],
    };
    listingApi
      .getListing({})
      .then((allListing) => this.setState({ allListing }));
  }
  render() {
    const { allListing } = this.state;
    console.log(allListing);
    return (
      <ThemeContext.Consumer>
        {({ darkMode }) => (
          <div className={classnames('all-listing-widget', { darkMode })}>
            {allListing.map((e) => {
              return (
                !!e.listingArr.length && (
                  <div className='category-with-listing'>
                    <div className='category-header'>
                      <div className='category-name'>{e.name}</div>
                      <div className='see-category-listing'>Xem tất cả</div>
                    </div>
                    <div className='listing-list-display'>
                      {e.listingArr.map((listing) => {
                        <ListingDisplay listing={listing} />;
                      })}
                    </div>
                  </div>
                )
              );
            })}
          </div>
        )}
      </ThemeContext.Consumer>
    );
  }
}
