import BoardSerializer from "./BoardSerializer.js";

class MatchSerializer {
  static async getSummary(match) {
    const allowedAttributes = ["id", "isFinished", "isRedsTurn", "board", "player1", "player2"];
    let serializedMatch = {};
    for (const attribute of allowedAttributes) {
      serializedMatch[attribute] = match[attribute];
    }
    return serializedMatch;
  }
}

export default MatchSerializer;