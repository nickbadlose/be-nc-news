const connection = require("../db/connection");

exports.fetchAll = (search) => {
  const searchUsers = connection("users")
    .select("username", "avatar_url")
    .where("username", search);

  const searchArticles = connection("articles").orderBy("created_at", "desc");

  const searchTopics = connection("topics").where("slug", search);

  return Promise.all([searchUsers, searchArticles, searchTopics]).then(
    ([user, articles, topic]) => {
      if (search.split(" ").length > 1) {
        const titleMatches = articles.filter((article) => {
          return search.split(" ").every((word) => {
            return article.title.toLowerCase().split(" ").includes(word);
          });
        });
        const bodyMatches = articles.filter((article) => {
          return article.body.toLowerCase().split(" ").includes(search);
        });
        return [...topic, ...user, ...titleMatches, ...bodyMatches];
      } else {
        const titleMatches = articles.filter((article) => {
          return article.title.toLowerCase().split(" ").includes(search);
        });
        const authorMatches = articles.filter((article) => {
          return article.author.toLowerCase() === search;
        });
        const bodyMatches = articles.filter((article) => {
          return article.body.toLowerCase().split(" ").includes(search);
        });
        return [
          ...topic,
          ...user,
          ...titleMatches,
          ...authorMatches,
          ...bodyMatches,
        ];
      }
    }
  );
};
