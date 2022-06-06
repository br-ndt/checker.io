import getUser from "../users/getUser.js";
import { Match, User } from "../../models/index.js";
import MatchSerializer from "../../serializers/MatchSerializer.js";
import BoardSerializer from "../../serializers/BoardSerializer.js";
import UserSerializer from "../../serializers/UserSerializer.js";
import checkGameIsEnded from "./checkGameIsEnded.js";

export default async (socket, roomId, fromTile, toTile) => {
  try {
    const currentMatch = await Match.query().findById(roomId);
    const serializedNewMatch = await MatchSerializer.getRoomInfo(currentMatch);
    if (serializedNewMatch) {
      if (socket.user) {
        const thisPlayerIsP1 =
          serializedNewMatch.player1 &&
          serializedNewMatch.player1 !== "None" &&
          socket.user.id === serializedNewMatch.player1.id;
        const thisPlayerIsP2 =
          serializedNewMatch.player2 &&
          serializedNewMatch.player2 !== "None" &&
          socket.user.id === serializedNewMatch.player2.id;

        const dx = toTile.x - fromTile.x;
        const dy = toTile.y - fromTile.y;
        const absX = Math.abs(dx);
        const absY = Math.abs(dy);

        let validTurn = false;
        if (absX > 0 && absX < 3 && absY > 0 && absY < 3) {
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
          if (movedPawn.isKinged) {
            kingMe = true;
          } else if (thisPlayerIsP1 && newTile.y === 0) {
            kingMe = true;
          } else if (thisPlayerIsP2 && newTile.y === 7) {
            kingMe = true;
          }

          await movedPawn.$query().patch({ tileId: newTile.id, isKinged: kingMe });

          let changeTurn = true;
          let gameOver = false;
          if (absX === 2 && absY === 2) {
            const jumpedX = fromTile.x + dx / 2;
            const jumpedY = fromTile.y + dy / 2;
            const jumpedTile = await board
              .$relatedQuery("tiles")
              .findOne({ x: jumpedX, y: jumpedY });
            await jumpedTile.$relatedQuery("pawn").delete();
            gameOver = await checkGameIsEnded(currentMatch.isRedsTurn, board);
            changeTurn = false;
          }

          if (gameOver) {
            await currentMatch.$query().patch({ isFinished: true, winnerId: socket.user.id });
            serializedNewMatch.isFinished = currentMatch.isFinished;
            const winner = await User.query().findById(socket.user.id);
            const wins = parseInt(winner.wins) + 1;
            await winner.$query().patchAndFetch({ wins });
            serializedNewMatch.winner = await UserSerializer.getSummary(winner);
            serializedNewMatch.winner.color = thisPlayerIsP1 ? "white" : "red";

            let loser;
            if (thisPlayerIsP1) loser = (await currentMatch.$relatedQuery("players"))[1];
            else if (thisPlayerIsP2) loser = (await currentMatch.$relatedQuery("players"))[0];
            const losses = parseInt(loser.losses) + 1;
            await loser.$query().patch({ losses });

          } else if (changeTurn) {
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