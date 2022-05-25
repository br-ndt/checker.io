import React, { useEffect, useState } from "react";
import MatchTile from "./MatchTile";

const Profile = ({ socket, user }) => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    socket.emit("getCurrentMatches", user, (data) => {
      setMatches(data);
    });
  }, []);

  let winRate = 0;
  const wins = parseInt(user.wins);
  const losses = parseInt(user.losses);
  if (losses > 0) {
    if (wins > 0) winRate = (100 * (wins / (wins + losses))).toPrecision(3);
  } else if (wins > 0) {
    winRate = 100;
  }

  const matchList = matches.map((match) => (
    <MatchTile key={`${user.id}-match-${match.id}`} match={match} />
  ));

  return (
    <div className="Profile">
      <div className="profile-body">
        <h3>{user.username}</h3>
        <hr />
        <p>Wins: {user.wins}</p>
        <p>Losses: {user.losses}</p>
        <p>Winrate: {winRate}%</p>
        <hr />
        <h4>Recent matches:</h4>
        <ul>
          {matchList}
        </ul>
      </div>
    </div>
  );
};

export default Profile;
