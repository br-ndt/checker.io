/**
 * @typedef {import("knex")} Knex
 */

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
  return knex.schema.createTable("matches", (t) => {
    t.bigIncrements("id");
    t.boolean("isFinished").notNullable();
    t.string("winner");
    t.boolean("isRedsTurn").notNullable();
    t.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
    t.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now());
  })
}

/**
 * @param {Knex} knex
 */
exports.down = (knex) => {
  return knex.schema.dropTableIfExists("matches");
}
