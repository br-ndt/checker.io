import React from "react";

const Pawn = ({ color, isDragging, drag }) => {
  return (
    <div ref={drag ? drag : null} className={`Pawn ${color} ${drag ? 'draggable' : ''} ${isDragging ? 'dragging' : ''}`}>
      <div className="img-overlay"/>
    </div>
  )
}

export default Pawn;