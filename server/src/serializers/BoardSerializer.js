import TileSerializer from "./TileSerializer.js";

class BoardSerializer {
  static async getSummary(board) {
    const allowedAttributes = ["id", "width", "height"];
    let serializedBoard = {};
    for (const attribute of allowedAttributes) {
      serializedBoard[attribute] = board[attribute];
    }
    return serializedBoard;
  }

  static async getFullBoard(board) {
    let serializedBoard = await this.getSummary(board);
    serializedBoard.rows = [];
    for (let i = 0; i < 8; ++i) {
      const thisRow = [];
      for (let j = 0; j < 8; ++j) {
        const tile = await board.$relatedQuery("tiles").findOne({ x: j, y: i });
        thisRow.push(await TileSerializer.getSummary(tile));
      }
      serializedBoard.rows.push(thisRow);
    }
    return serializedBoard;
  }
}

export default BoardSerializer;