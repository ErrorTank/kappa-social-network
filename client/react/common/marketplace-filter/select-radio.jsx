import React, { Component } from 'react';
import { Dropdownable } from './../dropdownable/dropdownable';
import { RadioGroup } from './../radio-group/radio-group';

export class SelectRadio extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <RadioGroup
        className='pt-0 mb-3'
        // onChange={(val) => {
        //   updateValue(`sortType`, val.value);
        // }}
        value={currentSortType}
        displayAs={(each) => each.label}
        isChecked={(each) => each.value === currentSortType.value}
        options={sortOptions}
      />
    );
  }
}
