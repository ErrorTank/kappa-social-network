import React, { Component } from 'react';
import { RadioGroup } from './../radio-group/radio-group';
import classnames from 'classnames';
import * as yup from 'yup';
import { createSimpleForm } from '../form-validator/form-validator';
import { KComponent } from './../k-component';

export class SelectRadio extends KComponent {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
    this.form = createSimpleForm(
      yup.object().shape({
        sorting: yup
          .string()
          .oneOf(['Lowest price first', 'Highest price first']),
      }),
      {
        initData: {
          sorting: 'Lowest price first',
        },
      }
    );
    this.onUnmount(
      this.form.on('change', () => {
        this.forceUpdate();
      })
    );
    this.form.validateData();
  }
  handleShow = () => {
    this.setState({ show: !this.state.show });
  };
  // addDefaultValue = () => {
  //   this.props.onChange(options[0]);
  // };
  render() {
    const { className, title, options } = this.props;
    return (
      <div className={classnames('select-radio', { className })}>
        <div className='select-radio-toggle' onClick={this.handleShow}>
          {title}
        </div>
        {this.form.enhanceComponent(
          'sorting',
          ({ error, onChange, onEnter, value }) => {
            let currentValue = options.find((each) => each.value === value);
            console.log(currentValue);
            return (
              <div className='select-form'>
                {this.state.show && (
                  <RadioGroup
                    className='pt-0 mb-3'
                    onChange={onChange((val) => val.value)}
                    value={currentValue}
                    displayAs={(each) => each.label}
                    isChecked={(each) => each.value === currentValue.value}
                    options={options}
                  />
                )}
              </div>
            );
          },
          true
        )}
      </div>
    );
  }
}
