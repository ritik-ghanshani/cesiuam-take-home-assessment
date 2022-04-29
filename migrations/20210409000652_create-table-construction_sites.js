"use strict";

exports.up = function (knex) {
  return knex.schema.createTable("construction_sites", function (table) {
    table.uuid("id").primary();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("construction_sites");
};
