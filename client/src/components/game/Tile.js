import React from "react";
import Pawn from "./Pawn";
import itemTypes from "../../constants/itemTypes.js";
import { useDrop } from "react-dnd";
import canDropPawn from "../../services/canDropPawn";
import DraggablePawn from "./DraggablePawn";

const Tile = ({
  id,
  x,
  y,
  pawnHere,
  getBoardCallback,
  movePawnCallback,
  clientColor,
  isClientsTurn,
}) => {
  const color = (x + y) % 2 === 1 ? "black" : "white";
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: itemTypes.PAWN,
      drop: (item) => {
        movePawnCallback(
          { x: item.x, y: item.y, pawn: pawnHere },
          { x, y, pawn: pawnHere },
          item
        );
      },
      canDrop: (item) => {
        return canDropPawn(x, y, item, pawnHere, getBoardCallback);
      },
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
      clientColor === pawnHere.color && isClientsTurn ? (
        <DraggablePawn
          isKinged={pawnHere.isKinged}
          tileId={id}
          x={x}
          y={y}
          color={pawnHere.color}
        />
      ) : (
        <Pawn isKinged={pawnHere.isKinged} color={pawnHere.color} />
      );
  }

  const tileLoc = (
    <p className="tileLoc">
      {x},{y}
    </p>
  );

  return (
    <li ref={drop} className={`Tile ${color}`}>
      {thisPawn}
      {isOver && !canDrop && <div className="drop-highlight red" />}
      {!isOver && canDrop && <div className="drop-highlight yellow" />}
      {isOver && canDrop && <div className="drop-highlight green" />}
      {tileLoc}
    </li>
  );
};

export default Tile;
