import React, { Component } from 'react';
import { RadioGroup } from './../radio-group/radio-group';
import classnames from 'classnames';
import * as yup from 'yup';
import { createSimpleForm } from '../form-validator/form-validator';
import { KComponent } from './../k-component';
import { marketplaceInfo } from './../../../common/states/common';

export class SelectRadio extends KComponent {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      value: null,
    };
    this.onUnmount(marketplaceInfo.onChange(() => this.forceUpdate()));
  }
  handleShow = () => {
    this.setState({ show: !this.state.show });
  };
  handleChangeSorting = (value) => {
    marketplaceInfo.setState({ ...marketplaceInfo.getState(), sort: value });
  };
  render() {
    const { className, title, options } = this.props;

    let def = marketplaceInfo.getState().sort || options[0];
    // console.log(def);
    return (
      <div className={classnames('select-radio', { className })}>
        <div className='select-radio-toggle' onClick={this.handleShow}>
          {title}
        </div>
        <div className='select-form'>
          {this.state.show && (
            <RadioGroup
              className='pt-0 mb-3'
              onChange={(val) => {
                this.handleChangeSorting(val);
              }}
              value={def}
              displayAs={(each) => each.label}
              isChecked={(each) => each.value === def.value}
              options={options.map((each) => ({
                ...each,
                id: each.label,
              }))}
            />
          )}
        </div>
      </div>
    );
  }
}
