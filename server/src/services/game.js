import { updateBoard } from "./board.js";
import { getUser } from "./users.js";
import { Match } from "../models/index.js";
import MatchSerializer from "../serializers/MatchSerializer.js";

export const movePawn = async (socketId, roomId, user, match) => {
  const checkMatch = await MatchSerializer.getRoomInfo(await Match.query().findById(roomId));
  if(checkMatch && match.id === checkMatch.id) {
    const thisUser = getUser(user.id);
    if(thisUser && thisUser.socketId === socketId) {
      if(checkMatch.isRedsTurn && checkMatch.player2 && checkMatch.player2 !== "None") {
        if(user.id === checkMatch.player2.id) {
          return updateBoard(checkMatch.id, match.board);
        }
      } else if(!checkMatch.isRedsTurn && checkMatch.player1 && checkMatch.player1 !== "None") {

      }
    }
  }
}