import React, { Component } from 'react';
import { KComponent } from './../../../../../common/k-component';
import { CommonLayout } from './../../../../../layout/common-layout/common-layout';
import { PageTitle } from './../../../../../common/page-title/page-title';
import { CreateListingInputWidget } from './../../marketplace-create-listing/create-listing-detail/cl-input-widget/cl-input-widget';
import { CreateListingPreviewWidget } from './../../marketplace-create-listing/create-listing-detail/cl-preview-widget/cl-preview-widget';
import { listingApi } from './../../../../../../api/common/listing-api';
import { numberToMoney } from '../../../../../../common/utils/listing-utils';

class EditListing extends KComponent {
  constructor(props) {
    super(props);
    this.state = {
      type: '',
      hoverArr: '',
      files: [],
    };
    listingApi
      .getListingByListingID(this.props.match.params.listingID)
      .then((e) => {
        let type;
        e.title
          ? (type = 'item')
          : e.make
          ? (type = 'vehicle')
          : (type = 'home');
        this.setState({
          ...e,
          type,
          price: numberToMoney(e.price.toString()),
          category: e.category.name,
        });
      });
  }

  updateValue = (key, val) => {
    this.setState({ [key]: val });
  };

  setValues = (newState) => {
    this.setState((prevState) => ({
      ...prevState,
      ...newState,
    }));
  };

  render() {
    // console.log(this.state);
    return (
      <div className='create-listing-detail'>
        <PageTitle title={'Chỉnh sửa niêm yết'}>
          <CommonLayout
            mainRender={() => <CreateListingPreviewWidget state={this.state} />}
            haveRightRender={false}
            leftRender={() => (
              <CreateListingInputWidget
                state={this.state}
                updateValue={this.updateValue}
                setValues={this.setValues}
                {...this.props}
                isEdit={true}
              />
            )}
          />
        </PageTitle>
      </div>
    );
  }
}

export default EditListing;
