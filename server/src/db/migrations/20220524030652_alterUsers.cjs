/**
 * @typedef {import("knex")} Knex
 */

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
  return knex.schema.table("users", (t) => {
    t.bigInteger("wins").notNullable();
    t.bigInteger("losses").notNullable();
  })
}

/**
 * @param {Knex} knex
 */
exports.down = (knex) => {
  return knex.schema.table("users", (t) => {
    t.dropColumn("wins");
    t.dropColumn("losses");
  })
}
