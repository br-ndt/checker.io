import { updateBoard } from "./board.js";
import { getUser } from "./users.js";
import { Match } from "../models/index.js";
import MatchSerializer from "../serializers/MatchSerializer.js";

export const movePawn = async (socketId, roomId, user, match) => {
  try {
    const currentMatch = await Match.query().findById(roomId);
    const serializedNewMatch = await MatchSerializer.getRoomInfo(currentMatch);
    if (serializedNewMatch && match.id === serializedNewMatch.id) {
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
          await currentMatch.$query().patch({ isRedsTurn: !currentMatch.isRedsTurn });
          serializedNewMatch.isRedsTurn = currentMatch.isRedsTurn;
          serializedNewMatch.board = await updateBoard(currentMatch.id, match.board);
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
