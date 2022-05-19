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

    socket.emit("userJoinMatchRoom", user.id, id, (data) => {
      setMatch(data);
    });

    socket.on("boardUpdate", (data) => {
      setMatch(data);
    });

    socket.on("notification", (data) => {
      console.log(`${data.title}: ${data.description}`);
    });
  }, []);

  const movePawn = (fromTile, toTile, pawn) => {
    if (canMovePawn(fromTile, toTile)) {
      const alteredRows = match.board.rows.map((row) => {
        return row.map((tile) => {
          if (tile.x === toTile.x && tile.y === toTile.y) {
            tile.pawn = pawn;
          } else if (tile.x === fromTile.x && tile.y === fromTile.y) {
            delete tile.pawn;
          }
          return tile;
        });
      });
      const newMatch = { ...match, board: { ...match.board, rows: alteredRows } };
      // setMatch(newMatch);
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
  const matchProps = { isClientsTurn, movePawn, clientColor };

  return (
    <div className="Match">
      <DndProvider backend={HTML5Backend}>
        <div className="central">
          <div className="player-wrapper">
            <p className="player red">Player 2: {match.player2.username}</p>
            <p className="player white">Player 1: {match.player1.username}</p>
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
