exports.up = function (knex) {
  return knex.schema.createTable("topics", (topicsTable) => {
    topicsTable.string("slug").unique().primary().notNullable();
    topicsTable.string("description").notNullable();
    topicsTable
      .string("image_url")
      .defaultTo(
        "https://images.unsplash.com/photo-1529243856184-fd5465488984\\?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&fm=jpg&w=400&fit=max"
      );
    topicsTable
      .string("image_thumb")
      .defaultTo(
        "https://images.unsplash.com/photo-1529243856184-fd5465488984\\?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&fm=jpg&w=200&fit=max"
      );
    topicsTable
      .string("image_banner")
      .defaultTo(
        "https://images.unsplash.com/photo-1529243856184-fd5465488984\\?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&w=1300&h=400&fit=crop&crop=edges"
      );
    topicsTable
      .string("mobile_banner")
      .defaultTo(
        "https://images.unsplash.com/photo-1529243856184-fd5465488984\\?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&w=600&h=200&fit=crop&crop=edges"
      );
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("topics");
};
