import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { ThemeContext } from '../../../../context/theme-context';
import { listingApi } from './../../../../../api/common/listing-api';
import { ListingDisplay } from './listing-display/listing-display';
import { insideCircle } from 'geolocation-utils';
import { LoadingInline } from './../../../../common/loading-inline/loading-inline';

export class AllListingWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listingByCategory: [],
      loading: false,
    };
  }
  componentDidUpdate(prevProps) {
    if (
      prevProps.radius !== this.props.radius ||
      prevProps.myPosition !== this.props.myPosition
    ) {
      this.setState({ loading: true });
      listingApi
        .getListing({
          radius: this.props.radius,
          lat: this.props.myPosition.lat,
          lon: this.props.myPosition.lon,
        })
        .then((allListing) => {
          let listingByCategory = allListing.filter(
            (e) => !!e.listingArr.length
          );
          this.setState({ listingByCategory, loading: false });
        });
    }
  }
  render() {
    const { listingByCategory, loading } = this.state;
    const { myPosition, radius } = this.props;
    console.log(listingByCategory);
    return (
      <ThemeContext.Consumer>
        {({ darkMode }) => {
          loading ? (
            <LoadingInline />
          ) : (
            <div className={classnames('all-listing-widget', { darkMode })}>
              {listingByCategory.map((e) => {
                return (
                  <div className='category-with-listing' key={e._id}>
                    <div className='category-header'>
                      <div className='category-name'>{e.name}</div>
                      <div className='see-category-listing'>Xem tất cả</div>
                    </div>
                    <div className='listing-list-display'>
                      {e.listingArr.map((listing) => {
                        return (
                          <ListingDisplay listing={listing} key={listing._id} />
                        );
                      })}
                    </div>
                    <div className='line-break'></div>
                  </div>
                );
              })}
            </div>
          );
        }}
      </ThemeContext.Consumer>
    );
  }
}
