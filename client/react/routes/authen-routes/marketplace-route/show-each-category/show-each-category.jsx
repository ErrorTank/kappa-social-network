import React, { Component } from 'react';
import { PageTitle } from './../../../../common/page-title/page-title';
import { CommonLayout } from './../../../../layout/common-layout/common-layout';
import { CategoryTraitWidget } from './category-trait-widget/category-trait-widget';
import { ListingByCategoryWidget } from './listing-by-category-widget/listing-by-category-widget';
import { marketplaceInfo } from './../../../../../common/states/common';
import { KComponent } from './../../../../common/k-component';

class ShowEachCategory extends KComponent {
  constructor(props) {
    super(props);
    this.state = {};

    this.onUnmount(
      marketplaceInfo.onChange((newState, oldState) => {
        if (newState.radius !== oldState.radius) this.forceUpdate();
      })
    );
  }

  componentDidMount() {
    const { radius, myPosition } = marketplaceInfo.getState();
    radius === undefined &&
      marketplaceInfo.setState({
        radius: localStorage.radius,
        myPosition: {
          lat: Number(localStorage.lat),
          lon: Number(localStorage.lon),
        },
      });
  }
  updateValue = (key, val) => {
    let oldState = marketplaceInfo.getState();
    localStorage.setItem([key], val);
    marketplaceInfo.setState({ ...oldState, [key]: val });
  };
  render() {
    const { radius, myPosition } = marketplaceInfo.getState();
    return (
      <PageTitle title={'Marketplace Category'}>
        <div className='marketplace-route'>
          <CommonLayout
            mainRender={() => (
              <ListingByCategoryWidget
                {...this.props}
                radius={radius}
                myPosition={myPosition}
              />
            )}
            haveRightRender={false}
            leftRender={() => (
              <CategoryTraitWidget
                {...this.props}
                radius={radius}
                updateValue={this.updateValue}
              />
            )}
          />
        </div>
      </PageTitle>
    );
  }
}
export default ShowEachCategory;
