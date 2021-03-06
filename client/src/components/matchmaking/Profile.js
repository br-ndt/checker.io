import React, { useEffect, useState } from "react";
import MatchTile from "./MatchTile";

const Profile = ({ socket, user }) => {
  const [matches, setMatches] = useState([]);
  const [userStats, setUserStats] = useState({
    wins: 0,
    losses: 0
  })

  useEffect(() => {
    socket.emit("getCurrentMatches", user, (data) => {
      setMatches(data);
    });

    socket.emit("getUserStats", user, (data) => {
      setUserStats(data);
    })
  }, []);

  let winRate = 0;
  const wins = parseInt(userStats.wins);
  const losses = parseInt(userStats.losses);
  if (losses > 0) {
    if (wins > 0) winRate = (100 * (wins / (wins + losses))).toPrecision(3);
  } else if (wins > 0) {
    winRate = 100;
  }

  const matchList = matches.map((match) => (
    <MatchTile key={`${user.id}-match-${match.id}`} match={match} user={user} />
  ));

  return (
    <div className="Profile">
      <div className="profile-body">
        <h3>{user.username}</h3>
        <hr />
        <p>Wins: {userStats.wins}</p>
        <p>Losses: {userStats.losses}</p>
        <p>Winrate: {winRate}%</p>
        <hr />
        <h4>Recent matches:</h4>
        <ul className="recent-matches">
          {matchList}
        </ul>
      </div>
    </div>
  );
};

export default Profile;
