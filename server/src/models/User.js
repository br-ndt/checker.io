/* eslint-disable import/no-extraneous-dependencies */
const Bcrypt = require("bcrypt");
const unique = require("objection-unique");
const Model = require("./Model");

const saltRounds = 10;

const uniqueFunc = unique({
  fields: ["email", "username"],
  identifiers: ["id"],
});

class User extends uniqueFunc(Model) {
  static get tableName() {
    return "users";
  }

  set password(newPassword) {
    this.cryptedPassword = Bcrypt.hashSync(newPassword, saltRounds);
  }

  authenticate(password) {
    return Bcrypt.compareSync(password, this.cryptedPassword);
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["email", "username"],

      properties: {
        username: { type: "string" },
        email: { type: "string", pattern: "^\\S+@\\S+\\.\\S+$" },
        cryptedPassword: { type: "string" },
      },
    };
  }

  $formatJson(json) {
    const serializedJson = super.$formatJson(json);

    if (serializedJson.cryptedPassword) {
      delete serializedJson.cryptedPassword;
    }

    return serializedJson;
  }

  static get relationMappings() {
    return {
      matches: {
        relation: Model.ManyToManyRelation,
        modelClass: require("./Match.js"),
        join: {
          from: "users.id",
          through: {
            from: "matchPlayers.userId",
            to: "matchPlayers.matchId",
          },
          to: "matches.id",
        },
      },
      matchPlayers: {
        relation: Model.HasManyRelation,
        modelClass: require("./MatchPlayer.js"),
        join: {
          from: "users.id",
          to: "matchPlayers.userId",
        },
      },
    }
  }
}

module.exports = User;
