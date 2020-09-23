import React, { Component } from 'react';
import { PageTitle } from '../../../common/page-title/page-title';
import { KComponent } from '../../../common/k-component';
import { CommonLayout } from '../../../layout/common-layout/common-layout';
import { BrowseAllWidget } from './browse-all-widget/browse-all-widget';
import { AllListingWidget } from './all-listing-widget/all-listing-widget';

class MarketplaceRoute extends KComponent {
  constructor(props) {
    super(props);
    this.state = {
      myPosition: '',
      radius: 10,
    };
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      let result = {
        lat: latitude,
        lon: longitude,
      };

      this.setState({ myPosition: result });
    });
  }
  updateValue = (key, val) => {
    this.setState({ [key]: val });
  };
  render() {
    return (
      <PageTitle title={'Marketplace'}>
        <div className='marketplace-route'>
          <CommonLayout
            mainRender={() => (
              <AllListingWidget
                myPosition={this.state.myPosition}
                radius={this.state.radius}
              />
            )}
            haveRightRender={false}
            leftRender={() => (
              <BrowseAllWidget
                updateValue={this.updateValue}
                radius={this.state.radius}
              />
            )}
          />
        </div>
      </PageTitle>
    );
  }
}
export default MarketplaceRoute;
