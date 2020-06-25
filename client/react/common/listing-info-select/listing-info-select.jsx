import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import { ClickOutside } from './../click-outside/click-outside';

export class ListingInfoSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if (this.state.show && prevState.show === false) {
      let selectDropdownElem = ReactDom.findDOMNode(this).querySelector(
        '.select-dropdown'
      );
      let selectedTarget = selectDropdownElem.querySelector('.selected');
      selectDropdownElem.scrollTop = selectedTarget.offsetTop;
    }
  };

  render() {
    let {
      className,
      label,
      options,
      value,
      onChange,
      displayAs = (val) => val,
      disabled = false,
      error,
      placeholder,
      isSelected = (option) => false,
      getOptionKey = (each, index) => index,
    } = this.props;
    return <div className={classnames('listing-info-select')}></div>;
  }
}
