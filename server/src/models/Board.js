const Model = require("./Model.js");

class Board extends Model {
  static get tableName() {
    return "boards";
  }

  static get relationMappings() {
    return {
      tiles: {
        relation: Model.HasManyRelation,
        modelClass: require("./Tile.js"),
        join: {
          from: "boards.id",
          to: "tiles.boardId",
        },
      },
      match: {
        relation: Model.BelongsToOneRelation,
        modelClass: require("./Match.js"),
        join: {
          from: "boards.matchId",
          to: "matches.id",
        },
      },
      pawns: {
        relation: Model.HasManyRelation,
        modelClass: require("./Pawn.js"),
        join: {
          from: "boards.id",
          through: {
            from: "tiles.boardId",
            to: "tiles.id"
          },
          to: "pawns.tileId"
        }
      }
    };
  }
}

module.exports = Board;
