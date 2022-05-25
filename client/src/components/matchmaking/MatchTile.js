import React from "react";
import { Link } from "react-router-dom";

const MatchTile = ({ match, user }) => {
  console.log(user);
  const matchStar = match.winner && match.winner.username === user.username ? <span className="gold">*</span> : "";
  const winnerMessage = match.winner ? <h5 className={`${match.winnerColor}`}>Winner: {matchStar}{match.winner.username}{matchStar}</h5> : "";

  const matchDetails = match.player2 && match.player2 !== "None" ? (
    <p className="matchDetails">
      <span className="white">{match.player1.username}</span> vs {""}
      <span className="red">{match.player2.username}</span>
    </p>
  ) : (
    <p className="matchDetails">
      <span className="white">{match.player1.username}</span> is awaiting an opponent...
    </p>
  );
  return (
    <li className="MatchTile">
      <Link to={`/matches/${match.id}`}>
        <div className="matchTile-body">
          <h3 className={`matchId ${match.winner ? "scratchout" : ""} ${matchStar ? "gold" : ""}`}>Match {match.id}</h3>
          {winnerMessage}
          {matchDetails}
        </div>
      </Link>
    </li>
  );
}

export default MatchTile;