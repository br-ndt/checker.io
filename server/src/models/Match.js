const Model = require("./Model.js");

class Match extends Model {
  static get tableName() {
    return "matches";
  }

  static get relationMappings() {
    return {
      board: {
        relation: Model.HasOneRelation,
        modelClass: require("./Board.js"),
        join: {
          from: "matches.id",
          to: "boards.matchId",
        },
      },
      matchPlayers: {
        relation: Model.HasManyRelation,
        modelClass: require("./MatchPlayer.js"),
        join: {
          from: "matches.id",
          to: "matchPlayers.matchId",
        },
      },
      players: {
        relation: Model.ManyToManyRelation,
        modelClass: require("./User.js"),
        join: {
          from: "matches.id",
          through: {
            from: "matchPlayers.matchId",
            to: "matchPlayers.userId"
          },
          to: "users.id"
        },
      }
    };
  }
}

module.exports = Match;
