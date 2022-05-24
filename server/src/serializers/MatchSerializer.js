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
    serializedMatch.player1 = await UserSerializer.getSummary((await match.$relatedQuery('players'))[0]);
    serializedMatch.player2 = await UserSerializer.getSummary((await match.$relatedQuery('players'))[1]);
    return serializedMatch;
  }

  static async getRoomInfo(match) {
    const allowedAttributes = ["id", "isFinished", "isRedsTurn"];
    let serializedMatch = {};
    for (const attribute of allowedAttributes) {
      serializedMatch[attribute] = match[attribute];
    }
    serializedMatch.player1 = await UserSerializer.getSummary((await match.$relatedQuery('players'))[0]);
    serializedMatch.player2 = await UserSerializer.getSummary((await match.$relatedQuery('players'))[1]);
    return serializedMatch;
  }
}

export default MatchSerializer;