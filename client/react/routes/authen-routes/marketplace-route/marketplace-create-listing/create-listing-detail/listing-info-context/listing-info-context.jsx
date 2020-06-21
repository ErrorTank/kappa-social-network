import React, { Component } from 'react';
import { KComponent } from './../../../../../../common/k-component';

export const ListingInfoContext = React.createContext();

export class ListingInfoController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: '',
      title: 'test',
    };
  }
  render() {
    return (
      <ListingInfoContext.Provider value={this.state}>
        {this.props.children}
      </ListingInfoContext.Provider>
    );
  }
}