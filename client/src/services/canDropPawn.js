import canMovePawn from "./canMovePawn.js";

const canDropPawn = (x, y, droppingPawn, pawnHere, getTileCallback) => {
  const dx = x - droppingPawn.x;
  const dy = y - droppingPawn.y;
  const absX = Math.abs(dx);
  const absY = Math.abs(dy);
  const middX = droppingPawn.x + dx / 2;
  const middY = droppingPawn.y + dy / 2;
  const middTile = absX === 2 && absY === 2 ? getTileCallback()[middY - 1][middX - 1] : undefined;
  return canMovePawn(
    middTile,
    { x, y, pawn: pawnHere },
    dx,
    dy,
    droppingPawn
  );
}

export default canDropPawn;