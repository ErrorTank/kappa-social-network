import React, { Component } from 'react';
import { KComponent } from '../../../../common/k-component';
import { CommonLayout } from '../../../../layout/common-layout/common-layout';
import { PageTitle } from '../../../../common/page-title/page-title';

class ListingSelling extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <PageTitle title={'Selling'}>
        <div className='listing-selling'>
          <CommonLayout
            mainRender={() => <div>ok</div>}
            haveRightRender={false}
            leftRender={() => <div></div>}
          />
        </div>
      </PageTitle>
    );
  }
}

export default ListingSelling;
