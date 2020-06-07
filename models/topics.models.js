const connection = require("../db/connection");
const axios = require("axios");

exports.fetchTopics = (slug, limit = 12, p = 1) => {
  const promises = [
    connection("topics")
      .select("topics.*")
      .leftJoin("articles", "topics.slug", "articles.topic")
      .count({ article_count: "articles.article_id" })
      .groupBy("topics.slug")
      .orderBy("article_count", "desc")
      .modify((query) => {
        if (slug) query.where("topics.slug", slug);
      })
      .limit(limit)
      .offset((p - 1) * 10),
    getTopicCount(),
  ];

  return Promise.all(promises).then(([topicsArr, total_count]) => {
    const topics = {
      topics: topicsArr,
      total_count,
    };

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
                  image_url:
                    results[0].urls.raw + "&fm=jpg&w=400&fit=crop&ar=1:1",
                  image_thumb:
                    results[0].urls.raw + "&fm=jpg&w=200&fit=crop&ar=1:1",
                  image_banner:
                    results[0].urls.raw +
                    "&auto=format&w=1300&h=400&fit=crop&crop=faces",
                  mobile_banner:
                    results[0].urls.raw +
                    "&auto=format&w=600&h=200&fit=crop&crop=faces",
                  image_card:
                    results[0].urls.raw +
                    "&auto=format&w=400&h=226&fit=crop&crop=faces",
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
          image_card: image.card,
        })
        .returning("*")
        .then(([topic]) => {
          return topic;
        });
};

const getTopicCount = () => {
  return connection("topics")
    .count({ total_count: "slug" })
    .then(([{ total_count }]) => {
      return total_count;
    });
};
