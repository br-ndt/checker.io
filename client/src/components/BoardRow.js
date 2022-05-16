import React from "react";
import Tile from "./Tile";

const BoardRow = ({ index, row, tileClick }) => {
  let colorIndex = index;
  return row.map((tile) => {
    ++colorIndex;
    return (
      <Tile
        color={colorIndex % 2 ? "black" : "white"}
        key={`tile-${tile.x}-${tile.y}`}
        x={tile.x}
        y={tile.y}
        tileClick={tileClick}
      />
    );
  });
};

export default BoardRow;
