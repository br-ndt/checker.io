import React from "react";
import Pawn from "./Pawn";
import itemTypes from "../../constants/itemTypes.js";
import { useDrag } from "react-dnd";

const DraggablePawn = ({ tileId, color, x, y }) => {
  const [{isDragging}, drag] = useDrag(() => ({
    type: itemTypes.PAWN,
    item: {
      tileId,
      x,
      y,
      color
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    }),
  }))

  return (
    <Pawn color={color} drag={drag} isDragging={isDragging}/>
  )
}

export default DraggablePawn;