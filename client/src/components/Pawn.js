import React from "react";
import itemTypes from "../constants/itemTypes.js";
import { useDrag } from "react-dnd";

const Pawn = ({ x, y, color }) => {
  const [{isDragging}, drag] = useDrag(() => ({
    type: itemTypes.PAWN,
    item: {
      x,
      y,
      color
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    }),
  }))

  return (
    <div ref={drag} className={`Pawn ${color} ${isDragging ? 'dragging' : ''}`}>
      <div className="img-overlay"/>
    </div>
  )
}

export default Pawn;