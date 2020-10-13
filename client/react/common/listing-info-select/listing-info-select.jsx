import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import { ClickOutside } from './../click-outside/click-outside';
import { customHistory } from './../../routes/routes';
import { split } from 'lodash';

export class ListingInfoSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      focus: false,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.show && prevState.show === false) {
      let selectDropdownElem = ReactDOM.findDOMNode(this).querySelector(
        '.select-dropdown'
      );
      let selectedTarget = selectDropdownElem.querySelector('.selected');
      if (selectedTarget)
        selectDropdownElem.scrollTop = selectedTarget.offsetTop;
    }
  }

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
      getOptionKey = (each, index) => index,
      id,
      isSelected = (option) => false,
      ...others
    } = this.props;
    return (
      <div
        id={id}
        className={classnames(`listing-info-select`, className, {
          'is-invalid': error,
          focus: this.state.show,
        })}
      >
        <ClickOutside
          onClickOut={() => this.setState({ show: false, focus: false })}
        >
          <label htmlFor={id} className='listing-info-wrapper'>
            <div
              className={classnames('listing-info-toggle')}
              onClick={() =>
                !disabled &&
                this.setState({
                  show: !this.state.show,
                  focus: !this.state.focus,
                })
              }
              id={id}
            >
              <div
                className={classnames('label-wrapper', {
                  'has-value': value,
                  disabled: disabled,
                })}
                {...others}
              >
                <span className='listing-info-value'>
                  {value ? displayAs(value) : label ? label : 'Chọn'}
                </span>
                <span className='listing-info-label'>{value && label}</span>
              </div>
              <div className='toggle-icon'>
                <i className='fas fa-caret-down'></i>
              </div>
            </div>
            {error && <div className='invalid-feedback'>{error.message}</div>}
            {this.state.show && (
              <div className='select-dropdown'>
                {options.map((each, i) => {
                  return each.isDisabled ? (
                    <div
                      key={getOptionKey(each, i)}
                      className={classnames('not-option', {
                        linked: each.link,
                      })}
                      onClick={() => {
                        if (each.link) {
                          customHistory.push(each.link);
                        }
                      }}
                    >
                      <div
                        className={classnames({
                          displayIcon: each.icon,
                        })}
                      >
                        {each.icon && <i className={each.icon}></i>}
                      </div>
                      <div
                        className={classnames('displayName', {
                          addition: !each.icon,
                        })}
                      >
                        {displayAs(each)}
                      </div>
                    </div>
                  ) : (
                    <div
                      key={getOptionKey(each, i)}
                      className={classnames('select-option', {
                        selected: isSelected(each),
                      })}
                      onClick={(e) => {
                        e.stopPropagation();
                        onChange(each);
                        this.setState({ show: false });
                      }}
                    >
                      <div className='option-name'>{displayAs(each)}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </label>
        </ClickOutside>
      </div>
    );
  }
}
