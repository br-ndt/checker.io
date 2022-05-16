const Model = require("./Model.js");

class Board extends Model {
  static get tableName() {
    return "boards";
  }

  static get relationMappings() {
    const { Tile } = require("./index.js");
    return {
      tiles: {
        relation: Model.HasManyRelation,
        modelClass: Tile,
        join: {
          from: "boards.id",
          to: "tiles.boardId",
        },
      },
    };
  }
}

module.exports = Board;
