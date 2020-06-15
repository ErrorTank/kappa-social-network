import React, { Component } from 'react';
import { MenuNavigationWithIcon } from '../../../../../common/menu-navigation-with-icon/menu-navigation-with-icon';
import { LineSeperate } from '../../../../../common/line-seperate/line-seperate';

export class CreateListingWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className='create-listing-widget'>
        <div className='create-listing-header'>
          <h1 className='create-listing-title'>Tạo bài niêm yết mới</h1>
        </div>
        <div className='create-listing-body'>
          <div className='pick-listing-type'>
            <MenuNavigationWithIcon
              icon={<i className='fas fa-tag'></i>}
              title={'Chọn loại bài niêm yết'}
              type={'main'}
            />
          </div>
          <LineSeperate />
          <div className='other-choice'>
            <MenuNavigationWithIcon
              icon={<i className='fas fa-user'></i>}
              title={'Bài niêm yết của bạn'}
            />
            <MenuNavigationWithIcon
              icon={<i className='fas fa-question-circle'></i>}
              title={'Trợ giúp người bán'}
            />
          </div>
        </div>
      </div>
    );
  }
}
