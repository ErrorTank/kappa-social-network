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
      id,
      ...others
    } = this.props;
    return (
      <ThemeContext.Consumer>
        {(theme) => (
          <div
            className={classnames('listing-info-input', className, {
              darkMode: theme?.darkMode,
              focus: this.state.focus,
            })}
          >
            <label htmlFor={id} className='listing-info-wrapper'>
              <input
                type='text'
                className={classnames('form-control', {
                  'is-invalid': error,
                  'is-valid': success,
                })}
                onFocus={() => this.setState({ focus: true })}
                onBlur={() => this.setState({ focus: false })}
                id={id}
                {...others}
                ref={(input) => (this.input = input)}
              />
              <span className='listing-info-label'>{label}</span>
            </label>
          </div>
        )}
      </ThemeContext.Consumer>
    );
  }
}
