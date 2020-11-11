import React from "react";
import { Route, Redirect } from "react-router-dom";

export function NotRequireProfileRoute({
  loading,
  hasProfile,
  render,
  ...rest
}) {
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
