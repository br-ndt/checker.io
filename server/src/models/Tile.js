const Model = require("./Model.js");

class Tile extends Model {
  static get tableName() {
    return "tiles";
  }

  static get relationMappings() {
    return {
      board: {
        relation: Model.BelongsToOneRelation,
        modelClass: require("./Board.js"),
        join: {
          from: "tiles.boardId",
          to: "boards.id",
        },
      },
      pawn: {
        relation: Model.HasOneRelation,
        modelClass: require("./Pawn.js"),
        join: {
          from: "tiles.id",
          to: "pawns.tileId",
        },
      },
    };
  }
}

module.exports = Tile;
