const Model = require("./Model.js");

class MatchPlayers extends Model {
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
          from: "userPlayers.userId",
          to: "users.id",
        },
      },
    };
  }
}

module.exports = MatchPlayers;
