import React from "react";
import BoardRow from "./BoardRow";

const Board = ({ rows }) => {
  const tileClick = (x, y) => {
    console.log(`Tile ${x},${y} was clicked`);
  };

  const tiles = rows.map((row, index) => {
    return (
      <ul className="BoardRow" key={`board-row-${index}`}>
        <BoardRow index={index} row={row} tileClick={tileClick} />
      </ul>
    );
  });

  return <div className="Board">{tiles}</div>;
};

export default Board;
