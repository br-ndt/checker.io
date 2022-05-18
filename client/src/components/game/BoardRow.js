import React from "react";
import Tile from "./Tile";

const BoardRow = ({ row, movePawnCallback, clientColor }) => {
  return row.map(tile => {
    return (
      <Tile
        key={`tile-${tile.x}-${tile.y}`}
        movePawnCallback={movePawnCallback}
        x={tile.x}
        y={tile.y}
        pawnHere={tile.pawn}
        clientColor={clientColor}
        id={tile.id}
      />
    );
  });
};

export default BoardRow;
