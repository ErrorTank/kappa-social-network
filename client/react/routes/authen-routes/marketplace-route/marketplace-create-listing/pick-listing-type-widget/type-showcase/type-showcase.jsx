import React, { Component } from 'react';
import { customHistory } from '../../../../../routes';
import classnames from 'classnames';

export class TypeShowcase extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    let { url, icon, title, description, className } = this.props;
    return (
      <div className={classnames('type-showcase', className)} key={url}>
        <div className='listing-type-wrapper'>
          <div className='listing-type-icon'>{icon}</div>
          <div className='listing-type-content'>
            <div className='listing-type-title'>{title}</div>
            <div className='listing-type-description'>{description}</div>
          </div>
        </div>
      </div>
    );
  }
}
