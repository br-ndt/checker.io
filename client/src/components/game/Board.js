import React, { useState } from "react";
import BoardRow from "./BoardRow";

const Board = ({ rows, movePawnCallback, clientColor }) => {
  const tiles = rows.map((row, index) => {
    return (
      <ul className="BoardRow" key={`board-row-${index}`}>
        <BoardRow index={index} row={row} movePawnCallback={movePawnCallback} clientColor={clientColor} />
      </ul>
    );
  });

  return <div className="Board">{tiles}</div>;
};

export default Board;
