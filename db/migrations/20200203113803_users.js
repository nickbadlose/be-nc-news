exports.up = function (knex) {
  return knex.schema.createTable("users", (usersTable) => {
    usersTable.string("username").unique().primary().notNullable();
    usersTable
      .string("avatar_url")
      .defaultTo(
        "https://www.tumbit.com/profile-image/4/original/mr-grumpy.jpg"
      );
    usersTable.timestamp("joined", { precision: 6 }).defaultTo(knex.fn.now(6));
    usersTable.string("name").notNullable();
    usersTable.string("password").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
