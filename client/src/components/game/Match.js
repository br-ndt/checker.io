import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Board from "./Board";
import canMovePawn from "../../services/canMovePawn.js";

const defaultBoard = {
  id: "0",
  width: 8,
  height: 8,
  rows: [[]],
};

const Match = ({ socket, user }) => {
  const id = useParams().id;
  const [board, setBoard] = useState(defaultBoard);

  useEffect(() => {
    socket.emit("matchLoaded", user, id, (data) => {
      console.log("the match has been loaded");
    });

    socket.emit("userJoinMatchRoom", user.id, id, (data) => {
      setBoard(data.board);
    });

    socket.on("boardUpdate", (data) => {
      setBoard(data.board);
    });

    socket.on("notification", (data) => {
      console.log(`${data.title}: ${data.description}`);
    })
  }, []);

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
      const newBoard = { ...board, rows: alteredRows };
      setBoard(newBoard);
      socket.emit("playerMovesPawn", id, user, newBoard, (data) => {
        console.log(data);
      });
    }
  };

  return (
    <div className="Match">
      <DndProvider backend={HTML5Backend}>
        <div className="Board-wrapper">
          <Board {...board} movePawnCallback={movePawn} />
        </div>
      </DndProvider>
    </div>
  );
};

export default Match;
