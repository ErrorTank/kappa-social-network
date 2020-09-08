import React, { Component } from 'react';
import { KComponent } from '../../../../../common/k-component';
import { CommonLayout } from '../../../../../layout/common-layout/common-layout';
import { PageTitle } from '../../../../../common/page-title/page-title';
import { CreateListingInputWidget } from './cl-input-widget/cl-input-widget';
import { customHistory } from './../../../../routes';
import { CreateListingPreviewWidget } from './cl-preview-widget/cl-preview-widget';

class CreateListingDetail extends KComponent {
  constructor(props) {
    super(props);
    this.state = {
      type: '',
      hoverArr: '',
      files: [],
    };
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
    return (
      <div className='create-listing-detail'>
        <PageTitle title={'Tạo niêm yết'}>
          <CommonLayout
            // className={}
            mainRender={() => <CreateListingPreviewWidget state={this.state} />}
            haveRightRender={false}
            leftRender={() => (
              <CreateListingInputWidget
                state={this.state}
                updateValue={this.updateValue}
                setValues={this.setValues}
                {...this.props}
              />
            )}
          />
        </PageTitle>
      </div>
    );
  }
}

export default CreateListingDetail;
