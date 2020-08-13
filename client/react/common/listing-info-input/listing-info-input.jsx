import React, { Component } from 'react';
import classnames from 'classnames';
import { ThemeContext } from '../../context/theme-context';
import ContentEditable from 'react-contenteditable';

export class ListingInfoInput extends Component {
  constructor(props) {
    super(props);
    this.contentEditable = React.createRef();
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
      id,
      inputType = 'input',
      value,
      contentEditable = false,
      ...others
    } = this.props;
    // contentEditable && console.log(value);
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
                htmlFor={id}
                className={classnames('listing-info-wrapper', {
                  textArea,
                })}
              >
                <textarea
                  className={classnames('form-control')}
                  onFocus={() => this.setState({ focus: true })}
                  onBlur={() => this.setState({ focus: false })}
                  id={id}
                  value={value}
                  {...others}
                ></textarea>
                <span className='listing-info-label'>{label}</span>
              </label>
            ) : (
              <label
                htmlFor={id}
                className={classnames('listing-info-wrapper', {
                  'has-value': value,
                  'is-invalid': error,
                  'is-valid': success,
                })}
              >
                {contentEditable ? (
                  <ContentEditable
                    innerRef={this.contentEditable}
                    html={value || ''} // innerHTML of the editable div
                    onChange={others.onChange} // handle innerHTML change
                    onFocus={() => this.setState({ focus: true })}
                    onBlur={() => this.setState({ focus: false })}
                    className={classnames('form-control', {
                      'is-invalid': error,
                      'is-valid': success,
                    })}
                  />
                ) : (
                  <input
                    type='text'
                    className={classnames('form-control', {
                      'is-invalid': error,
                      'is-valid': success,
                    })}
                    onFocus={() => this.setState({ focus: true })}
                    onBlur={() => this.setState({ focus: false })}
                    id={id}
                    value={value}
                    {...others}
                    ref={(input) => (this.input = input)}
                  />
                )}

                <span
                  className='listing-info-label'
                  onClick={() =>
                    contentEditable && this.contentEditable.current.focus()
                  }
                >
                  {label}
                </span>
              </label>
            )}
            {error && <div className='invalid-feedback'>{error}</div>}
          </div>
        )}
      </ThemeContext.Consumer>
    );
  }
}
