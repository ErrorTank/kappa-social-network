import React, { Component } from 'react';
import {
  itemField,
  vehicleField,
  homeField,
} from './../../../../../../const/listing';
import { MenuNavigationWithIcon } from './../../../../../common/menu-navigation-with-icon/menu-navigation-with-icon';

MenuNavigationWithIcon;
export class CategoriesSection extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    // let categoryList = getCategories();
  }
  getCategories = () => {};
  render() {
    return (
      <div className='categories-section'>
        <div className='line-seperate'></div>
        <h1>Danh muc</h1>
        {this.props.categoryDisplay.map((each) => {
          <MenuNavigationWithIcon
            key={each.title}
            icon={each.icon}
            title={each.title}
            type={each.type}
            onClick={() => customHistory.push(each.link)}
          />;
        })}
      </div>
    );
  }
}
