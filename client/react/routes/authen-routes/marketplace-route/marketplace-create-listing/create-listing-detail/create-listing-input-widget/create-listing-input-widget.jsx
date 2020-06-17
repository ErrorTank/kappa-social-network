import React, { Component } from 'react';

export class CreateListingInputWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className='create-listing-input-widget'>
        <div className='cs-input-header'>
          <div className='header-info'></div>
          <div className='save-draft'></div>
        </div>
        <div className='cs-input-body'></div>
        <div className='cs-input-footer'></div>
      </div>
    );
  }
}
