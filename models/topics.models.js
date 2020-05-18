const connection = require("../db/connection");
const axios = require("axios");

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

exports.addTopic = (slug, description, image_url) => {
  if (typeof slug !== "string" || typeof description !== "string") {
    return Promise.reject({ status: 400, msg: "Bad request!" });
  }

  return !image_url
    ? axios
        .get(`https://api.unsplash.com/search/photos`, {
          headers: { Authorization: "Client-ID " + process.env.UNSPLASH_KEY },
          params: { query: slug, orientation: "squarish" },
        })
        .then(({ data: { results } }) => {
          console.log(results);
          return results.length
            ? connection("topics")
                .insert({
                  slug,
                  description,
                  image_url: results[0].urls.small,
                })
                .returning("*")
            : connection("topics")
                .insert({
                  slug,
                  description,
                })
                .returning("*");
        })
        .then(([topic]) => {
          return topic;
        })
    : connection("topics")
        .insert({ slug, description, image_url })
        .returning("*")
        .then(([topic]) => {
          return topic;
        });
};
