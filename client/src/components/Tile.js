import React from "react";

const Tile = ({ color, x, y, tileClick }) => {
  return (
    <li
      onClick={(event) => {
        event.preventDefault();
        tileClick(x, y);
      }}
      className={`Tile ${color}`}
    >
      <p className="noselect">
        {x},{y}
      </p>
    </li>
  );
};

export default Tile;
