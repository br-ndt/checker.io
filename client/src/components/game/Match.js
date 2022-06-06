import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Board from "./Board";
import Chat from "../Chat/Chat";
import canDropPawn from "../../services/canDropPawn.js";

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
  const boardRef = useRef();
  boardRef.current = match.board;

  useEffect(() => {
    socket.on("opponentJoin", (data) => {
      setMatch(data);
    });

    socket.on("boardUpdate", (data) => {
      setMatch(data);
    });

    socket.emit("userJoinMatchRoom", id, (data) => {
      setMatch(data);
    });

    return () => {
      socket.emit("userLeftMatchRoom");
    };
  }, []);

  const getBoardTiles = () => {
    return boardRef.current.rows;
  };

  const getTileCallback = (x, y) => {
    return getBoardTiles()[y][x];
  };

  const movePawn = (fromTile, toTile, pawn) => {
    if (canDropPawn(pawn, toTile, getTileCallback)) {
      socket.emit("playerMovesPawn", { roomId: id, fromTile, toTile });
    }
  };

  const gameMessage = match.winner ? (
    <h3 className={`game-message ${match.winner.color}`}>{match.winner.username} wins the game!</h3>
  ) : null;

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

  const turnPrompt = match.winner ? null : isClientsTurn ? (
    <h4 className={`turn-prompt ${clientColor}`}>It's your turn!</h4>
  ) : match.player2.id ? (
    <h4 className={`turn-prompt ${opponentColor}`}>{opponentName} is taking their turn...</h4>
  ) : (
    <h4 className="turn-prompt white">Awaiting opponent...</h4>
  );
  const matchProps = { isClientsTurn, getTileCallback, movePawn, clientColor, gameMessage };

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
