import React from "react";
import Pawn from "./Pawn";
import itemTypes from "../constants/itemTypes.js";
import { useDrop } from "react-dnd";
import canMovePawn from "../services/canMovePawn";

const Tile = ({ x, y, pawnHere, movePawnCallback }) => {
  const color = (x + y) % 2 === 1 ? "black" : "white";
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: itemTypes.PAWN,
      drop: (item) => {
        movePawnCallback({ x: item.x, y: item.y }, { x, y, pawn: pawnHere ? true : false }, item);
      },
      canDrop: (item) => canMovePawn({ x: item.x, y: item.y }, { x, y, pawn: pawnHere ? true : false }),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop()
      }),
    }),
    [x, y, pawnHere]
  );

  const thisPawn = pawnHere ? <Pawn x={x} y={y} color={pawnHere.color} /> : null;

  return (
    <li ref={drop} className={`Tile ${color}`}>
      {thisPawn}
      {isOver && !canDrop && <div className="drop-highlight red" />}
      {!isOver && canDrop && <div className="drop-highlight yellow" />}
      {isOver && canDrop && <div className="drop-highlight green" />}
    </li>
  );
};

export default Tile;
