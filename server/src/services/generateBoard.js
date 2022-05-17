import { Board } from "../models/index.js";
import BoardSerializer from "../serializers/BoardSerializer.js";
import TileSerializer from "../serializers/TileSerializer.js";
import PawnSerializer from "../serializers/PawnSerializer.js";

const generateBoard = async (x, y) => {
  const newBoard = await Board.query().insertAndFetch({ width: x, height: y });
  const serializedBoard = await BoardSerializer.getSummary(newBoard);
  serializedBoard.rows = [];
  for (let i = 1; i <= y; ++i) {
    const thisRow = [];
    for (let j = 1; j <= x; ++j) {
      const newTile = await newBoard.$relatedQuery("tiles").insertAndFetch({ x: j, y: i });
      if((j + i) % 2 === 1) {
        if(i <= 3) {
          await newTile.$relatedQuery("pawn").insert({ color: "red" });
        } else if (i >= 6) {
          await newTile.$relatedQuery("pawn").insert({ color: "white" });
        }
      }
      thisRow.push(await TileSerializer.getSummary(newTile));
    }
    serializedBoard.rows.push(thisRow);
  }
  return serializedBoard;
};

export default generateBoard;
