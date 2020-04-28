const connection = require("../db/connection");

exports.fetchTopics = () => {
  return connection("topics")
    .select("topics.*")
    .leftJoin("articles", "topics.slug", "articles.topic")
    .count({ article_count: "articles.article_id" })
    .groupBy("topics.slug")
    .orderBy("article_count", "desc")
    .then((topics) => {
      return topics;
    });
};

exports.addTopic = (slug, description) => {
  if (typeof slug !== "string" || typeof description !== "string") {
    return Promise.reject({ status: 400, msg: "Bad request!" });
  }
  return connection("topics")
    .insert({ slug, description })
    .returning("*")
    .then(([topic]) => {
      return topic;
    });
};
