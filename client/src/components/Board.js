import React, { useState } from "react";
import BoardRow from "./BoardRow";

const Board = ({ rows, movePawnCallback }) => {
  const tiles = rows.map((row, index) => {
    return (
      <ul className="BoardRow" key={`board-row-${index}`}>
        <BoardRow index={index} row={row} movePawnCallback={movePawnCallback} />
      </ul>
    );
  });

  return <div className="Board">{tiles}</div>;
};

export default Board;
