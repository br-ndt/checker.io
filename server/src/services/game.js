import { getUser } from "./users.js";
import { Match } from "../models/index.js";
import MatchSerializer from "../serializers/MatchSerializer.js";
import BoardSerializer from "../serializers/BoardSerializer.js";

export const movePawn = async (socketId, roomId, user, fromTile, toTile) => {
  try {
    const currentMatch = await Match.query().findById(roomId);
    const serializedNewMatch = await MatchSerializer.getRoomInfo(currentMatch);
    if (serializedNewMatch) {
      const thisUser = getUser(user.id);
      if (thisUser && thisUser.socketId === socketId) {
        const thisPlayerIsP1 =
          serializedNewMatch.player1 &&
          serializedNewMatch.player1 !== "None" &&
          user.id === serializedNewMatch.player1.id;
        const thisPlayerIsP2 =
          serializedNewMatch.player2 &&
          serializedNewMatch.player2 !== "None" &&
          user.id === serializedNewMatch.player2.id;
        
        const dx = toTile.x - fromTile.x;
        const dy = toTile.y - fromTile.y;
        const absX = Math.abs(dx);
        const absY = Math.abs(dy);

        let validTurn = false;
        if(absX > 0 && absX < 3 && absY > 0 && absY < 3) {
          if (serializedNewMatch.isRedsTurn && thisPlayerIsP2) {
            validTurn = true;
          } else if (!serializedNewMatch.isRedsTurn && thisPlayerIsP1) {
            validTurn = true;
          }
        }

        if (validTurn) {
          const board = await currentMatch.$relatedQuery("board");
          const oldTile = await board
            .$relatedQuery("tiles")
            .findOne({ x: fromTile.x, y: fromTile.y });
          const newTile = await board.$relatedQuery("tiles").findOne({ x: toTile.x, y: toTile.y });
          
          let kingMe = false;
          const movedPawn = await oldTile.$relatedQuery("pawn");
          if(movedPawn.isKinged) {
            kingMe = true;
          } else if(thisPlayerIsP1 && newTile.y === 0) {
            kingMe = true;
          } else if(thisPlayerIsP2 && newTile.y === 7) {
            kingMe = true;
          }

          await movedPawn.$query().patch({ tileId: newTile.id, isKinged: kingMe });

          let changeTurn = true;
          if (absX === 2 && absY === 2) {
            const jumpedX = fromTile.x + dx / 2;
            const jumpedY = fromTile.y + dy / 2;
            const jumpedTile = await board
              .$relatedQuery("tiles")
              .findOne({ x: jumpedX, y: jumpedY });
            await jumpedTile.$relatedQuery("pawn").delete();
            checkGameIsEnded();
            changeTurn = false;
          }

          if (changeTurn) {
            await currentMatch.$query().patch({ isRedsTurn: !currentMatch.isRedsTurn });
          }
          
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

const checkGameIsEnded = () => {
  
}
