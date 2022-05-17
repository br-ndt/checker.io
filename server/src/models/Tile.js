const Model = require("./Model.js");

class Tile extends Model {
  static get tableName() {
    return "tiles";
  }

  static get relationMappings() {
    const { Board, Pawn } = require("./index.js");

    return {
      board: {
        relation: Model.BelongsToOneRelation,
        modelClass: Board,
        join: {
          from: "tiles.boardId",
          to: "boards.id",
        },
      },
      pawn: {
        relation: Model.HasOneRelation,
        modelClass: Pawn,
        join: {
          from: "tiles.id",
          to: "pawns.tileId",
        },
      },
    };
  }
}

module.exports = Tile;
