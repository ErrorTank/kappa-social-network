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
        className={classnames('listing-info-select', className, {
          error: !!error,
          focus: this.state.show,
        })}
      >
        <ClickOutside onClickOut={() => this.setState({ show: false })}>
          <label htmlFor={id} className='listing-info-wrapper'>
            <div
              className={classnames('listing-info-toggle')}
              onClick={() =>
                this.setState({
                  show: !this.state.show,
                })
              }
              id={id}
            >
              <div
                className={classnames('label-wrapper', {
                  'has-value': value,
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
            {this.state.show && (
              <div className='select-dropdown'>
                {options.map((each, i) => {
                  return each.isDisabled ? (
                    <div
                      key={getOptionKey(each, i)}
                      className={classnames('not-option', {
                        // linked: each.link,
                      })}
                      // onClick={() => {
                      //   if (each.link) {
                      //     customHistory.push(each.link);
                      //   }
                      // }}
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
                        {each.name}
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
                      <div className='option-name'>{each.name}</div>
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
