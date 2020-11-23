import React, { Component } from 'react';
import { Dropdownable } from './../dropdownable/dropdownable';
import { RadioGroup } from './../radio-group/radio-group';

export class SelectRadio extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const { className, title, setState, value, options } = this.props;
    return (
      <Dropdownable
        className={classnames('select-radio', { className })}
    toggle={() => <div className='select-radio-toggle'>{title}</div>}
        content={() => (
          <RadioGroup
            className='pt-0 mb-3'
            onChange={(val) => {
              setState(`sortType`, val.value);
            }}
            value={value}
            displayAs={(each) => each.label}
            isChecked={(each) => each.value === value}
            options={options}
          />
        )}
      />
    );
  }
}
