import React from "react";
import { Route, Redirect } from "react-router-dom";

export function RequireProfileRoute({ loading, hasProfile, render, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        !loading ? (
          !hasProfile ? (
            <Redirect
              to={{
                pathname: "/dating/register",
              }}
            />
          ) : (
            render(props)
          )
        ) : null
      }
    />
  );
}
