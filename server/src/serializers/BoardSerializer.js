class BoardSerializer {
  static async getSummary(board) {
    const allowedAttributes = ["id", "width", "height"];
    let serializedBoard = {};
    for (const attribute of allowedAttributes) {
      serializedBoard[attribute] = board[attribute];
    }
    return serializedBoard;
  }
}

export default BoardSerializer;