const Model = require("./Model.js");

class Pawn extends Model {
  static get tableName() {
    return "pawns";
  }

  static get relationMappings() {
    return {
      tile: {
        relation: Model.BelongsToOneRelation,
        modelClass: require("./Tile.js"),
        join: {
          from: "pawns.tileId",
          to: "tiles.id",
        },
      },
      board: {
        relation: Model.ManyToManyRelation,
        modelClass: require("./Board.js"),
        join: {
          from: "pawns.tileId",
          through: {
            from: "tiles.id",
            to: "tiles.boardId",
          },
          to: "boards.id",
        },
      },
    };
  }
}

module.exports = Pawn;
