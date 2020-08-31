import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { ThemeContext } from '../../../../context/theme-context';

export class AllListingWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
