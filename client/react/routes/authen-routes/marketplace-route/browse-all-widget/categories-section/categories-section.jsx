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
  }
  getCategories = () => {};
  render() {
    return (
      <div className='categories-section'>
        <div className='line-seperate'></div>
        <h1>Danh muc</h1>
        {this.props.children}
      </div>
    );
  }
}
