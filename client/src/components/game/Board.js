import React, { useState } from "react";
import BoardRow from "./BoardRow";

const Board = ({ getBoardTiles, movePawn, clientColor, isClientsTurn, rows }) => {
  let printRows = rows;
  if (clientColor === "red") {
    printRows = rows.slice().reverse();
  }
  const tiles = printRows.map((row, index) => {
    return (
      <ul className="BoardRow" key={`board-row-${index}`}>
        <BoardRow
          index={index}
          row={row}
          getBoardCallback={getBoardTiles}
          movePawnCallback={movePawn}
          isClientsTurn={isClientsTurn}
          clientColor={clientColor}
        />
      </ul>
    );
  });

  return <div className="Board">{tiles}</div>;
};

export default Board;
