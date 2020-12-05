import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { ThemeContext } from '../../../../context/theme-context';
import { listingApi } from './../../../../../api/common/listing-api';
import { ListingDisplay } from './listing-display/listing-display';
import { insideCircle } from 'geolocation-utils';
import { LoadingInline } from './../../../../common/loading-inline/loading-inline';
import { KComponent } from './../../../../common/k-component';
import { customHistory } from './../../../routes';

export class AllListingWidget extends KComponent {
  constructor(props) {
    super(props);
    this.state = {
      listingByCategory: [],
      loading: true,
    };
  }
  componentDidMount() {
    this.props.myPosition && this.getListingInRadius();
  }
  getListingInRadius = () => {
    const { radius, myPosition } = this.props;
    this.setState({ loading: true });
    listingApi
      .getListing({
        radius: radius,
        lat: myPosition.lat,
        lon: myPosition.lon,
      })
      .then((allListing) => {
        let listingByCategory = allListing.filter((e) => !!e.listingArr.length);
        this.setState({ listingByCategory, loading: false });
      });
  };
  componentDidUpdate(prevProps) {
    if (
      prevProps.radius !== this.props.radius ||
      prevProps.myPosition !== this.props.myPosition
    ) {
      this.getListingInRadius();
    }
  }
  render() {
    const { myPosition, radius } = this.props;
    const { listingByCategory, loading } = this.state;
    // console.log(listingByCategory);
    return (
      <ThemeContext.Consumer>
        {({ darkMode }) => {
          return loading ? (
            <LoadingInline />
          ) : (
            <div className={classnames('all-listing-widget', { darkMode })}>
              {listingByCategory.map((e) => {
                return (
                  <div className='category-with-listing' key={e._id}>
                    <div className='category-header'>
                      <div className='category-name'>{e.name}</div>
                      <div
                        className='see-category-listing'
                        onClick={() =>
                          customHistory.push(`/marketplace/${e._id}`)
                        }
                      >
                        Xem tất cả
                      </div>
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
