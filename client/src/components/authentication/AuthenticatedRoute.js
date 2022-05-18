import React from "react";
import { Redirect, Route } from "react-router";
import SocketContext from "../SocketContext";

const AuthenticationCheck = ({ component: Component, user }) => {
  if (user === undefined) {
    return <div>Loading...</div>;
  }
  if (user !== null) {
    return (
      <SocketContext user={user}>
        <Component user={user} />
      </SocketContext>
    );
  }
  return <Redirect to="/user-sessions/new" />;
};

const AuthenticatedRoute = ({ component, user, ...rest }) => {
  return (
    <Route
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
    >
      <AuthenticationCheck user={user} component={component} />
    </Route>
  );
};

export default AuthenticatedRoute;
