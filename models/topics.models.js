const connection = require("../db/connection");
const axios = require("axios");

exports.fetchTopics = (slug) => {
  return connection("topics")
    .select("topics.*")
    .leftJoin("articles", "topics.slug", "articles.topic")
    .count({ article_count: "articles.article_id" })
    .groupBy("topics.slug")
    .orderBy("article_count", "desc")
    .modify((query) => {
      if (slug) query.where("topics.slug", slug);
    })
    .then((topics) => {
      return topics;
    });
};

exports.addTopic = (slug, description, image) => {
  if (typeof slug !== "string" || typeof description !== "string") {
    return Promise.reject({ status: 400, msg: "Bad request!" });
  }

  return !image
    ? axios
        .get(`https://api.unsplash.com/search/photos`, {
          headers: { Authorization: "Client-ID " + process.env.UNSPLASH_KEY },
          params: { query: slug, orientation: "squarish" },
        })
        .then(({ data: { results } }) => {
          return results.length
            ? connection("topics")
                .insert({
                  slug,
                  description,
                  image_url: results[0].urls.small,
                  image_thumb: results[0].urls.thumb,
                  image_banner:
                    results[0].urls.raw +
                    "&auto=format&w=1300&h=400&fit=crop&crop=faces",
                  mobile_banner:
                    results[0].urls.raw +
                    "&auto=format&w=600&h=200&fit=crop&crop=faces",
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
        .insert({
          slug,
          description,
          image_url: image.url,
          image_thumb: image.thumb,
          image_banner: image.banner,
          mobile_banner: image.mobile_banner,
        })
        .returning("*")
        .then(([topic]) => {
          return topic;
        });
};
