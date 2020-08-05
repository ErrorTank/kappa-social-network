import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import { ClickOutside } from '../click-outside/click-outside';

export class Select extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
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
      placeholder,
      isSelected = (option) => false,
      getOptionKey = (each, index) => index,
    } = this.props;
    return (
      <div
        className={classnames('common-select m-0', className, {
          error: !!error,
          focus: this.state.show,
        })}
      >
        {label && <div className='select-label'>{label}</div>}
        <ClickOutside onClickOut={() => this.setState({ show: false })}>
          <div className='select-wrapper'>
            <div
              className={classnames('select-toggle', { disabled })}
              onClick={() => this.setState({ show: !this.state.show })}
            >
              {value ? displayAs(value) : placeholder ? placeholder : 'Chọn'}
            </div>
            {this.state.show && (
              <div className='select-dropdown'>
                {options.map((each, i) => (
                  <div
                    key={getOptionKey(each, i)}
                    className={classnames('select-option', {
                      disabled: each.isDisabled?.() || false,
                      selected: isSelected(each),
                    })}
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
          </div>
        </ClickOutside>
        {error && <div className='invalid-feedback'>{error.message}</div>}
      </div>
    );
  }
}
