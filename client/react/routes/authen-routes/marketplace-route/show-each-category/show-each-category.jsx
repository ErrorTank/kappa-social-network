import React, { Component } from 'react';
import { PageTitle } from './../../../../common/page-title/page-title';
import { CommonLayout } from './../../../../layout/common-layout/common-layout';
import { CategoryTraitWidget } from './category-trait-widget/category-trait-widget';
import { ListingByCategoryWidget } from './listing-by-category-widget/listing-by-category-widget';
import { marketplaceInfo } from './../../../../../common/states/common';
import { KComponent } from './../../../../common/k-component';
import { listingApi } from './../../../../../api/common/listing-api';

class ShowEachCategory extends KComponent {
  constructor(props) {
    super(props);
    this.state = {
      listingByCategory: {
        listingArr: [],
      },
      sortType: '',
    };

    this.onUnmount(
      marketplaceInfo.onChange((newState, oldState) => {
        console.log(oldState);
        console.log(newState);
        if (newState.radius !== oldState.radius) {
          this.forceUpdate();
        }
        if (this.formatSort(oldState.sort) !== this.formatSort(newState.sort)) {
          this.getListing();
        }
      })
    );
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.match.params.categoryID !== this.props.match.params.categoryID
    ) {
      this.getListing();
    }
  }

  formatSort = (sort) => {
    return !sort || sort.value === 'Lowest price first'
      ? {
          sortBy: 'price',
          orderBy: 'asc',
        }
      : {
          sortBy: 'price',
          orderBy: 'des',
        };
  };

  getListing = () => {
    let value = marketplaceInfo.getState().sort;
    let sort = this.formatSort(value);

    listingApi
      .getListingByCategoryID(this.props.match.params.categoryID, sort)
      .then((e) => this.setState({ listingByCategory: e }));
  };

  componentDidMount() {
    this.getListing();
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

  handleState = (key, val) => {
    this.setState({ [key]: val });
  };

  render() {
    const { radius, myPosition } = marketplaceInfo.getState();
    const { listingByCategory } = this.state;
    // console.log(listingByCategory);
    return (
      <PageTitle title={'Marketplace Category'}>
        <div className='marketplace-route'>
          <CommonLayout
            mainRender={() => (
              <ListingByCategoryWidget
                {...this.props}
                radius={radius}
                myPosition={myPosition}
                listingByCategory={listingByCategory}
              />
            )}
            haveRightRender={false}
            leftRender={() => (
              <CategoryTraitWidget
                {...this.props}
                radius={radius}
                updateValue={this.updateValue}
                handleState={this.handleState}
                state={this.state}
              />
            )}
          />
        </div>
      </PageTitle>
    );
  }
}
export default ShowEachCategory;
