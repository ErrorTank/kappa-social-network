import React from "react";
import {Route} from "react-router-dom"
import {TrackLocation} from "../../common/location-tracker";

export const WithLocationRoute = ({render, ...parentProps}) => (
  <Route
    {...parentProps}
    render={props => {

      return (
        <TrackLocation
          location={props.match.url}
          render={() => render(props)}
        />


      )
    }}
  />
);