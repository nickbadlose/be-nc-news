exports.up = function (knex) {
  return knex.schema.createTable("topics", (topicsTable) => {
    topicsTable.string("slug").unique().primary().notNullable();
    topicsTable.string("description").notNullable();
    topicsTable
      .string("image_url")
      .defaultTo(
        "https://images.unsplash.com/photo-1529243856184-fd5465488984\\?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=600&fit=max"
      );
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("topics");
};
