import React, { useState } from "react";
import BoardRow from "./BoardRow";

const Board = ({ getTileCallback, movePawn, clientColor, isClientsTurn, rows, gameMessage }) => {
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
          getTileCallback={getTileCallback}
          movePawnCallback={movePawn}
          isClientsTurn={isClientsTurn}
          clientColor={clientColor}
        />
      </ul>
    );
  });

  return (
    <div className="Board">
      {gameMessage}
      {tiles}
    </div>
  )
};

export default Board;
