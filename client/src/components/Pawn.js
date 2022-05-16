import React from "react";

const Pawn = (props) => {
  return (
    <div className={`Pawn ${props.color}`}>
      <div className="img-overlay"/>
    </div>
  )
}

export default Pawn;