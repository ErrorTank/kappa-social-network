import React, { Component } from 'react';
import { customHistory } from '../../../../../routes';

export class TypeShowcase extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    let { url, icon, title, description } = this.props;
    return (
      <div className='type-showcase' key={url}>
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
