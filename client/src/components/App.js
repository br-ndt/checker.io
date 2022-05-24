import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Redirect, Switch, Route } from "react-router-dom";
import { hot } from "react-hot-loader/root";
import AuthenticatedRoute from "./authentication/AuthenticatedRoute";
import getCurrentUser from "../services/getCurrentUser";
import RegistrationForm from "./registration/RegistrationForm";
import SignInForm from "./authentication/SignInForm";
import TopBar from "./layout/TopBar";
import Lobby from "./matchmaking/Lobby";
import Match from "./game/Match";
import Matchmaking from "./matchmaking/Matchmaking";

import "../assets/scss/main.scss";

const App = (props) => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const fetchCurrentUser = async () => {
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
    } catch (err) {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);


  return (
    <Router>
      <TopBar user={currentUser} />
      <Switch>
        <AuthenticatedRoute exact path="/matches" user={currentUser} component={Lobby}/>
        <AuthenticatedRoute exact path="/matches/new" user={currentUser} component={Matchmaking}/>
        <AuthenticatedRoute exact path="/matches/:id" user={currentUser} component={Match}/>
        <Route exact path="/">
          <Redirect to="/matches"/>
        </Route>
        <Route exact path="/users/new">
          <RegistrationForm user={currentUser}/>
        </Route>
        <Route exact path="/user-sessions/new">
          <SignInForm user={currentUser}/>
        </Route>
      </Switch>
    </Router>
  );
};

export default hot(App);
