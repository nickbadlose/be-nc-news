const ENV = process.env.NODE_ENV || "development";
const {
  topicData,
  articleData,
  commentData,
  userData,
} = require("../data/index.js");
const { formatDates, formatComments, makeRefObj } = require("../utils/utils");

exports.seed = function (knex) {
  const topicsInsertions = knex("topics").insert(topicData).returning("*");
  const usersInsertions = knex("users").insert(userData).returning("*");
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return Promise.all([topicsInsertions, usersInsertions]);
    })
    .then(([topicRows, userRows]) => {
      const formattedArticleData = formatDates(articleData);
      const promises = [
        knex("articles").insert(formattedArticleData).returning("*"),
        topicRows,
        userRows,
      ];
      return Promise.all(promises);
    })
    .then(([articleRows, topicRows, userRows]) => {
      const articleRef = makeRefObj(articleRows, "title", "article_id");
      const formattedComments = formatComments(
        commentData,
        articleRef,
        "article_id",
        "belongs_to"
      );
      return knex("comments").insert(formattedComments).returning("*");
    })
    .then((commentRows) => {
      // console.log(`${ENV} database seeded`);
    });
};
