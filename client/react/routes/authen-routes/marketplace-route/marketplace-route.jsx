import React, { Component } from 'react';
import { PageTitle } from '../../../common/page-title/page-title';
import { KComponent } from '../../../common/k-component';
import { CommonLayout } from '../../../layout/common-layout/common-layout';
import { BrowseAllWidget } from './browse-all-widget/browse-all-widget';
import { AllListingWidget } from './all-listing-widget/all-listing-widget';
import { marketplaceInfo } from './../../../../common/states/common';

class MarketplaceRoute extends KComponent {
  constructor(props) {
    super(props);
    this.state = {};
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      let result = {
        lat: latitude,
        lon: longitude,
      };
      marketplaceInfo.setState({ radius: 10, myPosition: result });
    });
    this.onUnmount(
      marketplaceInfo.onChange((newState, oldState) => {
        if (newState.radius !== oldState.radius) this.forceUpdate();
      })
    );
  }

  updateValue = (key, val) => {
    let oldState = marketplaceInfo.getState();
    marketplaceInfo.setState({ ...oldState, [key]: val });
  };

  render() {
    let info = marketplaceInfo.getState();
    const { radius, myPosition } = info;
    return (
      <PageTitle title={'Marketplace'}>
        <div className='marketplace-route'>
          <CommonLayout
            mainRender={() => (
              <AllListingWidget myPosition={myPosition} radius={radius} />
            )}
            haveRightRender={false}
            leftRender={() => (
              <BrowseAllWidget updateValue={this.updateValue} radius={radius} />
            )}
          />
        </div>
      </PageTitle>
    );
  }
}
export default MarketplaceRoute;
