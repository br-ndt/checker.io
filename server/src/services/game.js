import { getUser } from "./users.js";
import { Match, Tile, Pawn } from "../models/index.js";
import MatchSerializer from "../serializers/MatchSerializer.js";
import BoardSerializer from "../serializers/BoardSerializer.js";

export const movePawn = async (socketId, roomId, user, fromTile, toTile, pawn) => {
  try {
    console.log(roomId, toTile, fromTile, pawn);
    const currentMatch = await Match.query().findById(roomId);
    const serializedNewMatch = await MatchSerializer.getRoomInfo(currentMatch);
    if (serializedNewMatch) {
      const thisUser = getUser(user.id);
      if (thisUser && thisUser.socketId === socketId) {
        let validTurn = false;
        if (
          serializedNewMatch.isRedsTurn &&
          serializedNewMatch.player2 &&
          serializedNewMatch.player2 !== "None" &&
          user.id === serializedNewMatch.player2.id
        ) {
          validTurn = true;
        } else if (
          !serializedNewMatch.isRedsTurn &&
          serializedNewMatch.player1 &&
          serializedNewMatch.player1 !== "None" &&
          user.id === serializedNewMatch.player1.id
        ) {
          validTurn = true;
        }
        if (validTurn) {
          console.log('valid turn');
          await currentMatch.$query().patch({ isRedsTurn: !currentMatch.isRedsTurn });
          const board = await currentMatch.$relatedQuery("board");
          const oldTile = await board.$relatedQuery("tiles").findOne({ x: fromTile.x, y: fromTile.y });
          const newTile = await board.$relatedQuery("tiles").findOne({ x: toTile.x, y: toTile.y });
          await oldTile.$relatedQuery("pawn").patch({ tileId: newTile.id });
          serializedNewMatch.isRedsTurn = currentMatch.isRedsTurn;
          serializedNewMatch.board = await BoardSerializer.getFullBoard(board);
          return serializedNewMatch;
        } else {
          const serializedCurrentMatch = await MatchSerializer.getSummary(currentMatch);
          return serializedCurrentMatch;
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
};
