const canMovePawn = (absX, absY, middleTile, movedPawn) => {
  if (
    middleTile &&
    middleTile.pawn &&
    middleTile.pawn.color !== movedPawn.color
  ) {
    return true;
  }

  return absX === 1 && absY === 1;
};

export default canMovePawn;
