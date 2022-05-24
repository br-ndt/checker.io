import React from "react";
import Tile from "./Tile";

const BoardRow = ({ row, getTileCallback, movePawnCallback, clientColor, isClientsTurn }) => {
  let printRow = row;
  if(clientColor === "red") {
    printRow = row.slice().reverse();
  }
  return printRow.map(tile => {
    return (
      <Tile
        key={`tile-${tile.x}-${tile.y}`}
        getTileCallback={getTileCallback}
        movePawnCallback={movePawnCallback}
        x={tile.x}
        y={tile.y}
        pawnHere={tile.pawn}
        clientColor={clientColor}
        isClientsTurn={isClientsTurn}
        id={tile.id}
      />
    );
  });
};

export default BoardRow;
