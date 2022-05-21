/**
 * @typedef {import("knex")} Knex
 */

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
  return knex.schema.table("boards", (t) => {
    t.bigInteger("matchId").unsigned().notNullable().index().references("matches.id");
  });
}

/**
 * @param {Knex} knex
 */
exports.down = (knex) => {
  return knex.schema.table("boards", (t) => {
    t.dropColumn("matchId");
  })
}
