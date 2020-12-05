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
      if (!localStorage.getItem('radius')) localStorage.setItem('radius', 10);
      localStorage.setItem('lat', result.lat);
      localStorage.setItem('lon', result.lon);
      marketplaceInfo.setState({
        radius: localStorage.getItem('radius') || 10,
        myPosition: result,
      });
    });

    this.onUnmount(
      marketplaceInfo.onChange((newState, oldState) => {
        if (newState.radius !== oldState.radius) this.forceUpdate();
      })
    );
  }

  render() {
    return (
      <PageTitle title={'Marketplace'}>
        <div className='marketplace-route'>
          <CommonLayout
            mainRender={() => <AllListingWidget />}
            haveRightRender={false}
            leftRender={() => <BrowseAllWidget />}
          />
        </div>
      </PageTitle>
    );
  }
}
export default MarketplaceRoute;
