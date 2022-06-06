export default async (isRedsTurn, board) => {
  let gameOver;
  let pawns;

  if (isRedsTurn) {
    pawns = await board.$relatedQuery("pawns").where("color", "white");
  } else {
    pawns = await board.$relatedQuery("pawns").where("color", "red");
  }
  if (pawns.length <= 0) {
    gameOver = true;
  }

  return gameOver;
};