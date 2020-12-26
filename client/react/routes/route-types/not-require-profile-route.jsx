import React from "react";
import { Route, Redirect } from "react-router-dom";
import { datingProfile } from "../../../common/states/common";

export function NotRequireProfileRoute({ loading, render, ...rest }) {
  const hasProfile = datingProfile.getState();
  return (
    <Route
      {...rest}
      render={(props) => {
        console.log(loading);
        return !loading ? (
          hasProfile ? (
            <Redirect
              to={{
                pathname: "/dating",
              }}
            />
          ) : (
            render(props)
          )
        ) : null;
      }}
    />
  );
}
