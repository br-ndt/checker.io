import React, { useEffect, useState } from "react";

const Profile = ({ socket, user }) => {
  const winRate = (user.wins / user.losses).toPrecision(2);
  return (
    <div className="Profile">
      <div className="profile-body">
        <h3>{user.username}</h3>
        <hr/>
        <p>Wins: {user.wins}</p>
        <p>Losses: {user.losses}</p>
        <p>Winrate: {winRate}%</p>
      </div>
    </div>
  )
}

export default Profile;