import React from "react";
import { Route, Redirect } from "react-router-dom";
import { datingProfile } from "../../../common/states/common";

export function RequireProfileRoute({ loading, render, ...rest }) {
  const hasProfile = datingProfile.getState();
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
