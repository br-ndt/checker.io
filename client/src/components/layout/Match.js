import React, { useEffect, useState, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Board from "../Board";
import socketIO from "socket.io-client";
import canMovePawn from "../../services/canMovePawn.js";
const ENDPOINT =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://checker.io.herokuapp.com/";

const defaultBoard = {
  id: "0",
  width: 8,
  height: 8,
  rows: [[]],
};

const Match = ({ user }) => {
  const socket = useRef(socketIO(ENDPOINT));
  const [message, setMessage] = useState("connecting...");
  const [board, setBoard] = useState(defaultBoard);

  useEffect(() => {
    fetchBoard();
  }, []);

  useEffect(() => {
    if (user && board.id != 0) {
      let socketTimeout;
      socket.current.emit("addUser", { user: user.id, room: board.id }, () =>
        console.log(`User ${user.id} logged into room ${board.id}`)
      );

      socket.current.on("getUsers", (users) => console.log("Current users", users));
      socket.current.on("connect_error", () => {
        socketTimeout = setTimeout(() => socket.current.connect(), 5000);
      });
      socket.current.on("disconnect", () => {
        setMessage("server disconnected");
        setBoard(defaultBoard);
      });

      return () => {
        console.log(socket.current.id, " disconnected");
        if (socketTimeout) clearTimeout(socketTimeout);
        socket.current.disconnect();
      };
    }
  }, [board.id]);

  useEffect(() => {
    socket.current.on("boardUpdate", (data) => {
      setBoard(data);
    });
  }, []);

  const fetchBoard = async () => {
    try {
      const response = await fetch("/api/v1/boards");
      if (!response.ok) {
        throw new Error(`${response.status} (${response.statusText})`);
      }
      const boardData = await response.json();
      setBoard(boardData);
      setMessage("");
    } catch (error) {
      console.error(`Error in fetch: ${error}`);
    }
  };

  const movePawn = (fromTile, toTile, pawn) => {
    if (canMovePawn(fromTile, toTile)) {
      const alteredRows = board.rows.map((row) => {
        return row.map((tile) => {
          if (tile.x === toTile.x && tile.y === toTile.y) {
            tile.pawn = pawn;
          } else if (tile.x === fromTile.x && tile.y === fromTile.y) {
            delete tile.pawn;
          }
          return tile;
        });
      });
      setBoard({ ...board, rows: alteredRows });
    }
  };

  const messageSpace = message ? <h3 className="message">{message}</h3> : null;

  return (
    <div className="Match">
      <DndProvider backend={HTML5Backend}>
        <div className="Board-wrapper">
          {messageSpace}
          <Board {...board} movePawnCallback={movePawn} />
        </div>
      </DndProvider>
    </div>
  );
};

export default Match;
