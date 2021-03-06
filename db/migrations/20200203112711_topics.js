exports.up = function (knex) {
  return knex.schema.createTable("topics", (topicsTable) => {
    topicsTable.string("slug").unique().primary().notNullable();
    topicsTable.string("description").notNullable();
    topicsTable
      .string("image_url")
      .defaultTo(
        "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&fm=jpg&w=400&fit=crop&ar=1:1"
      );
    topicsTable
      .string("image_thumb")
      .defaultTo(
        "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&fm=jpg&w=200&fit=crop&ar=1:1"
      );
    topicsTable
      .string("image_banner")
      .defaultTo(
        "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&w=1300&h=400&fit=crop&crop=edges"
      );
    topicsTable
      .string("mobile_banner")
      .defaultTo(
        "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&w=600&h=200&fit=crop&crop=edges"
      );
    topicsTable
      .string("image_card")
      .defaultTo(
        "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&w=400&h=226&fit=crop&crop=edges"
      );
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("topics");
};
