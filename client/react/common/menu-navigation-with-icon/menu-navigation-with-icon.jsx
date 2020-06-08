import React, { Component } from 'react';
import classnames from 'classnames';

export class MenuNavigationWithIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    let { className, id, icon, darkMode, title, ...other } = this.props;
    return (
      <div className={classnames('menu-navigation-with-icon')}>
        <div className='menu-navigation-wrapper'>
          {icon && <span className='mn-icon'>{icon}</span>}
          <span className='mn-title'>{title}</span>
        </div>
      </div>
    );
  }
}
