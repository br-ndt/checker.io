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
          to: "tiles.id"
        }
      }
    }
  }
}

module.exports = Pawn;