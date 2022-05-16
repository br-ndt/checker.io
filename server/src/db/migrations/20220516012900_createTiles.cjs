/**
 * @typedef {import("knex")} Knex
 */

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
  return knex.schema.createTable("tiles", (t) => {
    t.bigIncrements("id");
    t.integer("x").unsigned().index().notNullable();
    t.integer("y").unsigned().index().notNullable();
    t.bigInteger("boardId").notNullable().unsigned().index().references("boards.id");
    t.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
    t.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now());
  });
};

/**
 * @param {Knex} knex
 */
exports.down = (knex) => {
  return knex.schema.dropTableIfExists("tiles");
};
