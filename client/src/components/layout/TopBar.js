import React from "react";
import { Link } from "react-router-dom";
import SignOutButton from "../authentication/SignOutButton";

const TopBar = ({ user }) => {
  const unauthenticatedListItems = [
    <li className="menu-button left" key="sign-in">
      <Link to="/user-sessions/new">Sign In</Link>
    </li>,
    <li className="menu-button right white" key="sign-up">
      <Link to="/users/new" className="button">
        Sign Up
      </Link>
    </li>,
  ];

  const authenticatedListItems = [
    <li key="welcome-user" className="menu-text static">Welcome, {user ? user.username : ""}!</li>,
    <li className="menu-button white" key="sign-out">
      <SignOutButton />
    </li>
  ];

  const newMatch = user ? (
    <li className="menu-text new-match"><Link to="/matches/new">New Match</Link></li>
  ) : null;

  return (
    <div className="top-bar TopBar">
      <div className="top-bar-left">
        <ul className="menu">
          <li className="menu-text app-title"><Link to="/matches"><div className="titleImg"/></Link></li>
          {newMatch}
        </ul>
      </div>
      <div className="top-bar-right">
        <ul className="menu">{user ? authenticatedListItems : unauthenticatedListItems}</ul>
      </div>
    </div>
  );
};

export default TopBar;
