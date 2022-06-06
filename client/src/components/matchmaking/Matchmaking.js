import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";

const Matchmaking = ({ socket, user }) => {
  const [match, setMatch] = useState(0);
  const [message, setMessage] = useState("Creating match...");

  useEffect(() => {
    if(user && socket) {
      socket.emit("createMatch", (matchId) => {
        setMatch(matchId);
      })
    } else {
      return <Redirect to={"/user-sessions/new"}/>
    }
  }, [])

  if(match) {
    return <Redirect to={`/matches/${match}`}/>
  } else {
    return <h3>{message}</h3>
  }
}

export default Matchmaking;