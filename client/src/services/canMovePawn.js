const canMovePawn = (middleTile, endTile, dx, dy, movedPawn) => {
  if (endTile.pawn) {
    return false;
  }

  if(!movedPawn.isKinged) {
    if(movedPawn.color === "white" && dy > 0) {
      return false;
    }
    if(movedPawn.color === "red" && dy < 0) {
      return false;
    }
  }

  const absX = Math.abs(dx);
  const absY = Math.abs(dy);
  if (
    absX === 2 &&
    absY === 2 &&
    middleTile.pawn &&
    middleTile.pawn.color &&
    middleTile.pawn.color !== movedPawn.color
  ) {
    return true;
  }

  return absX === 1 && absY === 1;
};

export default canMovePawn;
