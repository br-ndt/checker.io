const Model = require("./Model.js");

class MatchPlayer extends Model {
  static get tableName() {
    return "matchPlayers";
  }

  static get relationMappings() {
    return {
      match: {
        relation: Model.BelongsToOneRelation,
        modelClass: require("./Match.js"),
        join: {
          from: "matchPlayers.matchId",
          to: "matches.id",
        },
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: require("./User.js"),
        join: {
          from: "matchPlayers.userId",
          to: "users.id",
        },
      },
    };
  }
}

module.exports = MatchPlayer;
