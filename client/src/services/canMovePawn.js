const canMovePawn = (startPos, endPos) => {
  if (endPos.pawn) {
    return false;
  }
  const dx = endPos.x - startPos.x;
  const dy = endPos.y - startPos.y;

  console.log(endPos, !endPos.pawn && Math.abs(dx) === 1 && Math.abs(dy) === 1)
  return Math.abs(dx) === 1 && Math.abs(dy) === 1;
};

export default canMovePawn;
