const canMovePawn = (middleTile, endTile, dx, dy, movedPawnColor) => {
  if (endTile.pawn) {
    return false;
  }
  if(movedPawnColor === "white" && dy > 0) {
    return false;
  } else if(movedPawnColor === "red" && dy < 0) {
    return false;
  }

  const absX = Math.abs(dx);
  const absY = Math.abs(dy);
  if (
    absX === 2 &&
    absY === 2 &&
    middleTile.pawn &&
    middleTile.pawn.color &&
    middleTile.pawn.color !== movedPawnColor
  ) {
    return true;
  }

  return absX === 1 && absY === 1;
};

export default canMovePawn;
