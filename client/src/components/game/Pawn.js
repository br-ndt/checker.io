import React from "react";

const Pawn = ({ color, isKinged, isDragging, drag }) => {
  return (
    <div
      ref={drag ? drag : null}
      className={`Pawn ${color} ${drag ? "draggable" : ""} ${isDragging ? "dragging" : ""}`}
    >
      <div className={`${isKinged ? "king" : "pawn"} img-overlay`} />
    </div>
  );
};

export default Pawn;
