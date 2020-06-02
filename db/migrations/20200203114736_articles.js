exports.up = function (knex) {
  return knex.schema.createTable("articles", (articlesTable) => {
    articlesTable.increments("article_id").primary();
    articlesTable.string("title").notNullable();
    articlesTable.text("body").notNullable();
    articlesTable.integer("votes").defaultTo(0);
    articlesTable.string("topic").references("topics.slug").notNullable();
    articlesTable.string("author").references("users.username").notNullable();
    articlesTable
      .timestamp("created_at", { precision: 6 })
      .defaultTo(knex.fn.now(6));
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("articles");
};
