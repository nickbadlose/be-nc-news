exports.up = function(knex) {
  console.log("created topics table");
  return knex.schema.createTable("topics", topicsTable => {
    topicsTable
      .string("slug")
      .unique()
      .primary()
      .notNullable();
    topicsTable.string("description").notNullable();
  });
};

exports.down = function(knex) {
  console.log("removing topics table");
  return knex.schema.dropTable("topics");
};
