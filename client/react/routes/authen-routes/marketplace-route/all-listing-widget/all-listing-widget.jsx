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
import { marketplaceInfo } from './../../../../../common/states/common';

export class AllListingWidget extends KComponent {
  constructor(props) {
    super(props);
    this.state = {
      listingByCategory: [],
      loading: true,
    };
    this.onUnmount(
      marketplaceInfo.onChange((newState, oldState) => {
        if (newState.radius !== oldState.radius) {
          this.getListingInRadius();
          this.forceUpdate();
        }
      })
    );
  }
  componentDidMount() {
    let info = marketplaceInfo.getState();
    const { radius, myPosition } = info;
    myPosition && this.getListingInRadius();
  }

  getListingInRadius = () => {
    let info = marketplaceInfo.getState();
    const { radius, myPosition } = info;
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

  render() {
    let info = marketplaceInfo.getState();
    const { radius, myPosition } = info;
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
                          insideCircle(
                            listing.position,
                            myPosition,
                            radius * 1000
                          ) && (
                            <ListingDisplay
                              listing={listing}
                              key={listing._id}
                            />
                          )
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
