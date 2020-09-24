import React, { Component } from 'react';
import { PageTitle } from './../../../../common/page-title/page-title';
import { CommonLayout } from './../../../../layout/common-layout/common-layout';
import { CategoryTraitWidget } from './category-trait-widget/category-trait-widget';

class ShowEachCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <PageTitle title={'Marketplace'}>
        <div className='marketplace-route'>
          <CommonLayout
            mainRender={() => <div>ok</div>}
            haveRightRender={false}
            leftRender={() => <CategoryTraitWidget />}
          />
        </div>
      </PageTitle>
    );
  }
}
export default ShowEachCategory;
