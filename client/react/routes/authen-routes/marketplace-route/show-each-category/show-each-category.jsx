import React, { Component } from 'react';
import { PageTitle } from './../../../../common/page-title/page-title';
import { CommonLayout } from './../../../../layout/common-layout/common-layout';
import { CategoryTraitWidget } from './category-trait-widget/category-trait-widget';
import { ListingByCategoryWidget } from './listing-by-category-widget/listing-by-category-widget';

class ShowEachCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      radius: 10,
    };
  }
  updateValue = (key, val) => {
    this.setState({ [key]: val });
  };
  render() {
    return (
      <PageTitle title={'Marketplace'}>
        <div className='marketplace-route'>
          <CommonLayout
            mainRender={() => <ListingByCategoryWidget {...this.props} />}
            haveRightRender={false}
            leftRender={() => (
              <CategoryTraitWidget
                {...this.props}
                radius={this.state.radius}
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
