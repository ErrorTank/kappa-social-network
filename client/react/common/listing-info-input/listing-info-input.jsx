import React, { Component } from 'react';
import classnames from 'classnames';
import { ThemeContext } from '../../context/theme-context';

export class ListingInfoInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focus: false,
    };

    focus = () => {
      this.input.focus();
    };
  }
  render() {
    const {
      className,
      label,
      error = false,
      success = false,
      textArea = false,
      ...others
    } = this.props;
    // console.log(textArea);
    return (
      <ThemeContext.Consumer>
        {(theme) => (
          <div
            className={classnames('listing-info-input', className, {
              darkMode: theme?.darkMode,
              focus: this.state.focus,
            })}
          >
            {textArea ? (
              <label
                htmlFor={label}
                className={classnames('listing-info-wrapper', {
                  textArea,
                })}
              >
                <textarea
                  className='form-control'
                  id={label}
                  {...others}
                ></textarea>
                <span className='listing-info-label'>{label}</span>
              </label>
            ) : (
              <label htmlFor={label} className='listing-info-wrapper'>
                <input
                  type='text'
                  className={classnames('form-control', {
                    'is-invalid': error,
                    'is-valid': success,
                  })}
                  onFocus={() => this.setState({ focus: true })}
                  onBlur={() => this.setState({ focus: false })}
                  id={label}
                  {...others}
                  ref={(input) => (this.input = input)}
                />
                <span className='listing-info-label'>{label}</span>
              </label>
            )}
          </div>
        )}
      </ThemeContext.Consumer>
    );
  }
}
