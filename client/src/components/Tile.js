import React from "react";
import Pawn from "./Pawn";

const Tile = ({ color, x, y, tileClick }) => {
  const redPawn = x === 2 && y === 7 ? (
    <Pawn color="red"/>
  ) : null;

  const whitePawn = x === 4 && y === 3 ? (
    <Pawn color="white"/>
  ) : null;

  return (
    <li
      onClick={(event) => {
        event.preventDefault();
        tileClick(x, y);
      }}
      className={`Tile ${color}`}
    >
      {/* <p className="noselect">
        {x},{y}
      </p> */}
      {redPawn}
      {whitePawn}
    </li>
  );
};

export default Tile;
