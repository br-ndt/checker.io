import React, { useEffect, useState } from "react";
import Board from "./Board";
import socketIO from "socket.io-client";
const ENDPOINT = "http://localhost:3000";

const defaultBoard = {
  width: 8,
  height: 8,
  rows: [[]],
};

const Match = () => {
  const [message, setMessage] = useState("connecting...");
  const [board, setBoard] = useState(defaultBoard);

  useEffect(() => {
    fetchBoard();
    
    const socket = socketIO(ENDPOINT);
    let socketTimeout;
    socket.on("connect", () => console.log(socket.id, " connected"));
    socket.on("connect_error", () => {
      socketTimeout = setTimeout(() => socket.connect(), 5000);
    });
    socket.on("boardUpdate", (data) => {
      setBoard(data);
    });
    socket.on("disconnect", () => {
      setMessage("server disconnected");
      setBoard(defaultBoard);
    });

    return () => {
      console.log(socket.id, " disconnected");
      if (socketTimeout) clearTimeout(socketTimeout);
      socket.disconnect();
    };
  }, []);

  const fetchBoard = async () => {
    try {
      const response = await fetch("/api/v1/boards");
      if (!response.ok) {
        throw new Error(`${response.status} (${response.statusText})`);
      }
      const boardData = await response.json();
      setBoard(boardData);
    } catch (error) {
      console.error(`Error in fetch: ${error}`);
    }
  };

  useEffect(() => {
    
  }, []);

  return (
    <div className="Match">
      <div className="Board-wrapper">
        <Board {...board}/>
      </div>
    </div>
  )
}

export default Match;