import React, { Component } from 'react';
import classnames from 'classnames';

export class MenuNavigationWithIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    let { className, id, icon, darkMode, title, type, ...other } = this.props;
    return (
      <div
        className={classnames('menu-navigation-with-icon', type || `${type}`)}
      >
        <div className='menu-navigation-wrapper'>
          {icon && <div className='mn-icon'>{icon}</div>}
          <div className='mn-title-wrapper'>
            <span className='mn-title'>{title}</span>
          </div>
        </div>
      </div>
    );
  }
}
