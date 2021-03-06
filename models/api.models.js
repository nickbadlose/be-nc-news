const connection = require("../db/connection");

exports.fetchAll = (search) => {
  const searchUsers = connection("users")
    .select("username", "avatar_url", "joined")
    .where("username", search);

  const searchArticles = connection("articles")
    .select("articles.*")
    .orderBy("created_at", "desc")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .count({ comment_count: "comment_id" })
    .groupBy("articles.article_id");

  const searchTopics = connection("topics")
    .select("topics.*")
    .where("slug", search)
    .leftJoin("articles", "topics.slug", "articles.topic")
    .count({ article_count: "articles.article_id" })
    .groupBy("topics.slug");

  return Promise.all([searchUsers, searchArticles, searchTopics]).then(
    ([user, articles, topic]) => {
      if (search.split(" ").length > 1) {
        const matchIds = {};

        const titleMatches = articles.filter((article) => {
          if (
            search.split(" ").every((word) => {
              if (article.title.toLowerCase().split(" ").includes(word)) {
                return true;
              }
            })
          ) {
            matchIds[article.article_id] = true;
            return true;
          }
        });

        const bodyMatches = articles.filter((article) => {
          if (
            search.split(" ").every((word) => {
              if (article.body.toLowerCase().split(" ").includes(word)) {
                if (matchIds[article.article_id] === undefined) {
                  return true;
                }
              }
            })
          ) {
            matchIds[article.article_id] = true;
            return true;
          }
        });

        return [...topic, ...user, ...titleMatches, ...bodyMatches];
      } else {
        const matchIds = {};

        const titleMatches = articles.filter((article) => {
          if (article.title.toLowerCase().split(" ").includes(search)) {
            matchIds[article.article_id] = true;
            return true;
          }
        });

        const authorMatches = articles.filter((article) => {
          if (article.author.toLowerCase() === search) {
            if (matchIds[article.article_id] === undefined) {
              matchIds[article.article_id] = true;
              return true;
            }
          }
        });

        const bodyMatches = articles.filter((article) => {
          if (article.body.toLowerCase().split(" ").includes(search)) {
            if (matchIds[article.article_id] === undefined) {
              matchIds[article.article_id] = true;
              return true;
            }
          }
        });

        const topicMatches = articles.filter((article) => {
          if (article.topic.toLowerCase() === search) {
            if (matchIds[article.article_id] === undefined) {
              matchIds[article.article_id] = true;
              return true;
            }
          }
        });

        return [
          ...topic,
          ...user,
          ...titleMatches,
          ...authorMatches,
          ...bodyMatches,
          ...topicMatches,
        ];
      }
    }
  );
};
