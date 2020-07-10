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
      onChange,
      displayAs = (val) => val,
      disabled = false,
      error,
      getOptionKey = (each, index) => index,
    } = this.props;

    let { show } = this.state;
    return (
      <div
        className={classnames('listing-info-select', className, {
          error: !!error,
          focus: show,
        })}
      >
        <ClickOutside onClickOut={() => this.setState({ show: false })}>
          <label htmlFor={label} className='listing-info-wrapper'>
            <div
              className={classnames('listing-info-toggle')}
              onClick={() => this.setState({ show: !show })}
              id={label}
            >
              <span className='listing-info-label'>
                {label ? displayAs(label) : 'Chọn'}
              </span>
              <div className='toggle-icon'>
                <i className='fas fa-sort-down'></i>
              </div>
            </div>
            {show && (
              <div className='select-dropdown'>
                {options.map((each, i) => (
                  <div
                    key={getOptionKey(each, i)}
                    className={classnames('select-option')}
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange(each);
                      this.setState({ show: false });
                    }}
                  >
                    {displayAs(each)}
                  </div>
                ))}
              </div>
            )}
          </label>
        </ClickOutside>
      </div>
    );
  }
}
