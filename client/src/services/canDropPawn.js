import canMovePawn from "./canMovePawn.js";

const canDropPawn = (droppingPawn, dropzoneTile, getTileCallback) => {
  if (dropzoneTile.pawn) {
    console.log("occupied");
    return false;
  }
  const dx = dropzoneTile.x - droppingPawn.x;
  const dy = dropzoneTile.y - droppingPawn.y;
  
  if (!droppingPawn.isKinged) {
    if (droppingPawn.color === "white" && dy > 0) {
      return false;
    }
    if (droppingPawn.color === "red" && dy < 0) {
      return false;
    }
  }
  
  const absX = Math.abs(dx);
  const absY = Math.abs(dy);
  console.log("endTile", dropzoneTile);

  let middTile;
  if(absX === 2 && absY === 2) {
    const middX = droppingPawn.x + dx / 2;
    const middY = droppingPawn.y + dy / 2;
    middTile = getTileCallback(middX - 1, middY - 1);
    console.log("middTile", middTile);
  }

  return canMovePawn(
    absX,
    absY,
    middTile,
    droppingPawn
  );
}

export default canDropPawn;