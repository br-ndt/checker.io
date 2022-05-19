import React, { useState } from "react";
import BoardRow from "./BoardRow";

const Board = ({ movePawn, clientColor, isClientsTurn, rows }) => {
  const tiles = rows.map((row, index) => {
    return (
      <ul className="BoardRow" key={`board-row-${index}`}>
        <BoardRow index={index} row={row} movePawnCallback={movePawn} isClientsTurn={isClientsTurn} clientColor={clientColor} />
      </ul>
    );
  });

  return <div className="Board">{tiles}</div>;
};

export default Board;
