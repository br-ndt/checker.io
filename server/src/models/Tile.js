const Model = require("./Model.js");

class Tile extends Model {
  static get tableName() {
    return "tiles";
  }

  static get relationMappings() {
    const { Board } = require("./index.js");

    return {
      board: {
        relation: Model.BelongsToOneRelation,
        modelClass: Board,
        join: {
          from: "tiles.boardId",
          to: "boards.id",
        },
      },
    };
  }
}

module.exports = Tile;
