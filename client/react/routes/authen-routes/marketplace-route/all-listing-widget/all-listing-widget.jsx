import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { ThemeContext } from '../../../../context/theme-context';
import { listingApi } from './../../../../../api/common/listing-api';

export class AllListingWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    // listingApi.getListing({}).then((listingArr) => console.log(listingArr));
  }
  render() {
    return (
      <ThemeContext.Consumer>
        {({ darkMode }) => (
          <div className={classnames('all-listing-widget', { darkMode })}>
            {' '}
            ok
          </div>
        )}
      </ThemeContext.Consumer>
    );
  }
}
