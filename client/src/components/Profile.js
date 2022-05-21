import React, { useEffect, useState } from "react";

const Profile = ({ socket, user }) => {
  return (
    <div className="Profile">
      <div className="profile-body">
        <h3>{user.username}</h3>
        <hr/>
        <p>Wins: 73</p>
        <p>Losses: 58</p>
        <p>Winrate: 55.7%</p>
      </div>
    </div>
  )
}

export default Profile;