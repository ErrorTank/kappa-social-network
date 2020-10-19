import { each } from 'lodash';
import React, { Component } from 'react';
import { customHistory } from '../../routes/routes';
import { createBreadcrumbBuilder } from './breadcrumbs-stucture';

export class Breadcrumbs extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    let { location } = customHistory;
    const breadcrumbsArray = createBreadcrumbBuilder(location.pathname);
    console.log(breadcrumbsArray);
    return (
      <div className='breadcrumbs-container'>
        {breadcrumbsArray.length > 1 && (
          <div className='breadcrumbs'>
            {breadcrumbsArray.map((e) => (
              <div
                className='breadcrumbs-item'
                key={each.url}
                onClick={() => customHistory.push(each.url)}
              >
                {each.label}
              </div>
            ))}
          </div>
        )}
        {this.props.children}
      </div>
    );
  }
}
