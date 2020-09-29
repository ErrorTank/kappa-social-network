import React, { Component } from 'react';
import classnames from 'classnames';
import { each } from 'lodash';

export class MenuNavigationWithIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focus: this.props.mainID === this.props.id && 'main',
    };
    !!this.props.options.length &&
      this.props.options.forEach((e) => {
        if (this.props.mainID === e._id) {
          this.setState({ focus: 'sup' });
        }
      });
  }
  render() {
    let {
      className,
      id,
      icon,
      darkMode,
      title,
      type,
      onClick,
      options = [],
      mainID,
      ...other
    } = this.props;
    const { focus } = this.state;
    return (
      <div
        className={classnames(
          'menu-navigation-with-icon',
          type || focus || `${type}`
        )}
        onClick={onClick}
      >
        <div className='menu-navigation-wrapper'>
          {icon && (
            <div className='mn-icon'>
              <i className={icon}></i>
            </div>
          )}
          <div className='mn-title-wrapper'>
            <span className='mn-title'>{title}</span>
          </div>
        </div>
        {(!!options.length || focus) &&
          options.map((e) => (
            <div
              className={classnames('children-navigation-wrapper')}
              key={e._id}
            >
              <div className='children-navigation'>{e.name}</div>
            </div>
          ))}
      </div>
    );
  }
}
