import React from "react";
import Pawn from "./Pawn";
import itemTypes from "../../constants/itemTypes.js";
import { useDrop } from "react-dnd";
import canMovePawn from "../../services/canMovePawn";
import DraggablePawn from "./DraggablePawn";

const Tile = ({
  id,
  x,
  y,
  pawnHere,
  getTileCallback,
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
          { x: item.x, y: item.y, pawn: true },
          { x, y, pawn: pawnHere ? true : false },
          item
        );
      },
      canDrop: (item) => {
        const dx = x - item.x;
        const dy = y - item.y;
        const absX = Math.abs(dx);
        const absY = Math.abs(dy);
        const middX = item.x + dx / 2;
        const middY = item.y + dy / 2;
        return canMovePawn(
          absX === 2 && absY === 2 ? getTileCallback(middX, middY) : undefined,
          { x, y, pawn: pawnHere ? true : false },
          dx,
          dy,
          item.color
        );
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
