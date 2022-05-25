import BoardSerializer from "./BoardSerializer.js";
import UserSerializer from "./UserSerializer.js";

class MatchSerializer {
  static async getSummary(match) {
    const allowedAttributes = ["id", "isFinished", "isRedsTurn", "board"];
    let serializedMatch = {};
    for (const attribute of allowedAttributes) {
      serializedMatch[attribute] = match[attribute];
    }
    serializedMatch.board = await BoardSerializer.getFullBoard(await match.$relatedQuery("board"));
    serializedMatch.player1 = await UserSerializer.getSummary(
      (
        await match.$relatedQuery("players")
      )[0]
    );
    serializedMatch.player2 = await UserSerializer.getSummary(
      (
        await match.$relatedQuery("players")
      )[1]
    );
    if (match.winnerId) {
      if(match.winnerId === serializedMatch.player1.id) {
        serializedMatch.winner = serializedMatch.player1;
        serializedMatch.winner.color = "white";
      } else if(match.winnerId === serializedMatch.player2.id) {
        serializedMatch.winner = serializedMatch.player2;
        serializedMatch.winner.color = "red";
      }
    }
    return serializedMatch;
  }

  static async getRoomInfo(match) {
    const allowedAttributes = ["id", "isFinished", "isRedsTurn"];
    let serializedMatch = {};
    for (const attribute of allowedAttributes) {
      serializedMatch[attribute] = match[attribute];
    }
    const player1 = (await match.$relatedQuery("players"))[0];
    const player2 = (await match.$relatedQuery("players"))[1];
    serializedMatch.player1 = await UserSerializer.getSummary(player1);
    serializedMatch.player2 = await UserSerializer.getSummary(player2);
    if(match.winnerId) {
      if(match.winnerId === player1.id) {
        serializedMatch.winner = serializedMatch.player1;
        serializedMatch.winnerColor = "white";
      } else if (match.winnerId === player2.id) {
        serializedMatch.winner = serializedMatch.player2;
        serializedMatch.winnerColor = "red";
      }
    }
    return serializedMatch;
  }
}

export default MatchSerializer;
