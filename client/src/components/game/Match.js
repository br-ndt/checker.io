import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Board from "./Board";
import Chat from "../Chat/Chat";
import canMovePawn from "../../services/canMovePawn.js";

const defaultBoard = {
  id: "0",
  width: 8,
  height: 8,
  rows: [[]],
};

const Match = ({ socket, user }) => {
  const id = useParams().id;
  const [match, setMatch] = useState({
    player1: {
      id: "",
      username: "",
    },
    player2: {
      id: "",
      username: "",
    },
    isFinished: false,
    isRedsTurn: true,
    board: defaultBoard,
  });

  useEffect(() => {
    socket.on("opponentJoin", (data) => {
      setMatch(data);
    });

    socket.on("boardUpdate", (data) => {
      setMatch(data);
    });

    socket.on("notification", (data) => {
      console.log(`${data.title}: ${data.description}`);
    });

    socket.emit("userJoinMatchRoom", user.id, id, (data) => {
      setMatch(data);
    });
  }, []);

  const getTile = (x, y) => {
    if (match.board.rows[y - 1] && match.board.rows[y - 1][x - 1]) {
      return match.board.rows[y - 1][x - 1];
    }
  };

  const movePawn = (fromTile, toTile, pawn) => {
    let middleTile;
    const dx = toTile.x - fromTile.x;
    const dy = toTile.y - fromTile.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    if (absX === 2 && absY === 2) {
      middleTile = getTile(fromTile.x + dx / 2, fromTile.y + dy / 2);
    }
    if (
      canMovePawn(
        middleTile,
        toTile,
        dx,
        dy,
        pawn.color
      )
    ) {
      socket.emit("playerMovesPawn", id, user, fromTile, toTile, pawn, (data) => {
        console.log(data);
      });
    }
  };

  const clientColor =
    user.id === match.player1.id ? "white" : user.id === match.player2.id ? "red" : "";

  const opponentName =
    user.id === match.player1.id ? match.player2.username : match.player1.username;
  const opponentColor = clientColor === "white" ? "red" : clientColor === "red" ? "white" : "";

  const topPlayer =
    clientColor === "red" ? (
      <p className="player white">Player 1: {match.player1.username}</p>
    ) : (
      <p className="player red">Player 2: {match.player2.username}</p>
    );

  const bottomPlayer =
    clientColor === "red" ? (
      <p className="player red">Player 2: {match.player2.username}</p>
    ) : (
      <p className="player white">Player 1: {match.player1.username}</p>
    );

  let isClientsTurn = false;
  if (clientColor) {
    if (
      (clientColor === "red" && match.isRedsTurn) ||
      (clientColor === "white" && !match.isRedsTurn)
    ) {
      isClientsTurn = true;
    }
  }

  const turnPrompt = isClientsTurn ? (
    <h4 className={`turn-prompt ${clientColor}`}>It's your turn!</h4>
  ) : match.player2.id ? (
    <h4 className={`turn-prompt ${opponentColor}`}>{opponentName} is taking their turn...</h4>
  ) : (
    <h4 className="turn-prompt white">Awaiting opponent...</h4>
  );
  const matchProps = { isClientsTurn, getTile, movePawn, clientColor };

  return (
    <div className="Match">
      <DndProvider backend={HTML5Backend}>
        <div className="central">
          <div className="player-wrapper">
            {topPlayer}
            {bottomPlayer}
          </div>
          <div className="Board-wrapper">
            <Board {...match.board} {...matchProps} />
            {turnPrompt}
          </div>
          <div className="flex-break" />
          <div className="Chat-wrapper">
            <div className="room-info">Room {match.id} Chat</div>
            <Chat user={user} socket={socket} room={id} />
          </div>
        </div>
      </DndProvider>
    </div>
  );
};

export default Match;
