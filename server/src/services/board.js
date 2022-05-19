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

export const updateBoard = async (matchId, newBoard) => {
  try {
    const board = await Board.query().findOne({ matchId });
    for (let i = 0; i < 8; ++i) {
      for (let j = 0; j < 8; ++j) {
        const pawnHere = newBoard.rows[i][j].pawn;
        if (pawnHere) {
          const oldTile = await board.$relatedQuery("tiles").findById(pawnHere.tileId);
          const newTile = await board.$relatedQuery("tiles").findOne({ x: j+1, y: i+1 });
          const pawn = await oldTile.$relatedQuery("pawn");
          if(pawn) await pawn.$query().patchAndFetchById(pawn.id, { tileId: newTile.id });
        }
      }
    }
    const serializedBoard = await BoardSerializer.getFullBoard(board);
    return serializedBoard;
  } catch (error) {
    console.error(error);
  }
};
