import React, { Component } from 'react';
import { KComponent } from '../common/k-component';

export const ListingInfoContext = React.createContext();

export class ListingInfoController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: '',
      title: '',
      limit: '',
    };
  }
  updateValue = (key, val) => {
    this.setState({ [key]: val });
  };

  updateMoreValue = (oldState, newState) => {};
  render() {
    return (
      <ListingInfoContext.Provider
        value={{ state: this.state, updateValue: this.updateValue }}
      >
        {this.props.children}
      </ListingInfoContext.Provider>
    );
  }
}
