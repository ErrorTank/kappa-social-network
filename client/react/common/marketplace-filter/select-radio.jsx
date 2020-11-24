import React, { Component } from 'react';
import { RadioGroup } from './../radio-group/radio-group';
import classnames from 'classnames';
export class SelectRadio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }
  handleShow = () => {
    this.setState({ show: !this.state.show });
  };
  render() {
    const { className, title, onChange, value = '', options } = this.props;
    // console.log(options);
    return (
      <div className={classnames('select-radio', { className })}>
        <div className='select-radio-toggle' onClick={this.handleShow}>
          {title}
        </div>
        {this.state.show && (
          <RadioGroup
            className='pt-0 mb-3'
            onChange={onChange}
            value={value}
            displayAs={(each) => each.label}
            isChecked={(each) => each.value === value}
            options={options}
          />
        )}
      </div>
    );
  }
}
