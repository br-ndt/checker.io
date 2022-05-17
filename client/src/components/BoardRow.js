import React from "react";
import Tile from "./Tile";

const BoardRow = ({ row, movePawnCallback }) => {
  return row.map(tile => {
    return (
      <Tile
        key={`tile-${tile.x}-${tile.y}`}
        movePawnCallback={movePawnCallback}
        x={tile.x}
        y={tile.y}
        pawnHere={tile.pawn}
      />
    );
  });
};

export default BoardRow;
