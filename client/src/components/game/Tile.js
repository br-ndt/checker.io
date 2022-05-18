import React from "react";
import Pawn from "./Pawn";
import itemTypes from "../../constants/itemTypes.js";
import { useDrop } from "react-dnd";
import canMovePawn from "../../services/canMovePawn";
import DraggablePawn from "./DraggablePawn";

const Tile = ({ id, x, y, pawnHere, movePawnCallback, clientColor }) => {
  const color = (x + y) % 2 === 1 ? "black" : "white";
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: itemTypes.PAWN,
      drop: (item) => {
        movePawnCallback({ x: item.x, y: item.y }, { x, y, pawn: pawnHere ? true : false }, item);
      },
      canDrop: (item) =>
        canMovePawn({ x: item.x, y: item.y }, { x, y, pawn: pawnHere ? true : false }),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [x, y, pawnHere]
  );

  let thisPawn = null;
  if (pawnHere) {
    thisPawn =
      clientColor === pawnHere.color ? (
        <DraggablePawn tileId={id} x={x} y={y} color={pawnHere.color} />
      ) : (
        <Pawn color={pawnHere.color} />
      );
  }

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
