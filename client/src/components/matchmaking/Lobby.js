import React, { useState, useEffect } from "react";
import MatchTile from "./MatchTile";
import Profile from "./Profile";

const Lobby = ({ socket, user }) => {
  const [matchList, setMatchList] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);

  useEffect(() => {
    socket.on("getMatches", (data) => {
      setMatchList(data);
    });

    socket.emit("enterLobby", (data) => {
      setMatchList(data);
    });

    return () => {
      socket.off("getMatches");
    };
  }, []);

  const matches = matchList.map((match) => (
    <MatchTile key={`matchTile ${match.id}`} match={match} />
  ));

  return (
    <div className="Lobby">
      <ul className="matchTiles">
        {matches}
      </ul>
      <Profile socket={socket} user={user} />
    </div>
  );
};

export default Lobby;
