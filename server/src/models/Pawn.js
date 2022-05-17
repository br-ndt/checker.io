const Model = require("./Model.js");

class Pawn extends Model {
  static get tableName() {
    return "pawns";
  }

  static get relationMappings() {
    const { Tile } = require("./index");
    return {
      tile: {
        relation: Model.BelongsToOneRelation,
        modelClass: Tile,
        join: {
          from: "pawns.tileId",
          to: "tiles.id"
        }
      }
    }
  }
}

module.exports = Pawn;