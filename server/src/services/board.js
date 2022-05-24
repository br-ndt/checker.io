import { Board } from "../models/index.js";
import BoardSerializer from "../serializers/BoardSerializer.js";
import TileSerializer from "../serializers/TileSerializer.js";

export const generateBoard = async (matchId) => {
  const newBoard = await Board.query().insertAndFetch({ width: 8, height: 8, matchId });
  const serializedBoard = await BoardSerializer.getSummary(newBoard);
  serializedBoard.rows = [];
  for (let i = 1; i <= 8; ++i) {
    const thisRow = [];
    for (let j = 1; j <= 8; ++j) {
      const newTile = await newBoard.$relatedQuery("tiles").insertAndFetch({ x: j, y: i });
      if ((j + i) % 2 === 1) {
        if (i <= 3) {
          await newTile.$relatedQuery("pawn").insert({ isKinged: false, color: "red" });
        } else if (i >= 6) {
          await newTile.$relatedQuery("pawn").insert({ isKinged: false, color: "white" });
        }
      }
      thisRow.push(await TileSerializer.getSummary(newTile));
    }
    serializedBoard.rows.push(thisRow);
  }
  return serializedBoard;
};