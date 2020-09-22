import React, { Component } from 'react';
import classnames from 'classnames';
import { each } from 'lodash';

export class MenuNavigationWithIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
      ...other
    } = this.props;
    return (
      <div
        className={classnames('menu-navigation-with-icon', type || `${type}`)}
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
        {!!options.length &&
          options.map((e) => (
            <div className='children-navigation-wrapper'>
              <div className='children-navigation'>{e.name}</div>
            </div>
          ))}
      </div>
    );
  }
}
