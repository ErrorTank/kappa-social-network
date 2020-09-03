import React, { Component } from 'react';
import {
  itemField,
  vehicleField,
  homeField,
} from './../../../../../../const/listing';

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
      </div>
    );
  }
}
