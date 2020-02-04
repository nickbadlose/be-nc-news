const connection = require("../db/connection");

exports.fetchArticleById = article_id => {
  const promises = [
    connection("articles")
      .select("*")
      .where({ article_id }),
    connection("comments")
      .select("*")
      .where({ article_id })
  ];
  return Promise.all(promises).then(([articleArr, comments]) => {
    if (!articleArr.length) {
      return Promise.reject({ status: 404, msg: "Not found!" });
    }
    const [article] = articleArr;
    article.comment_count = comments.length;
    return article;
  });
};

exports.editArticleById = (article_id, votes) => {
  if (votes === undefined) {
    return Promise.reject({ status: 422, msg: "Incomplete request!" });
  }
  return connection("articles")
    .where({ article_id })
    .increment({ votes })
    .returning("*")
    .then(articleArr => {
      if (!articleArr.length) {
        return Promise.reject({ status: 404, msg: "Not found!" });
      }
      return articleArr;
    });
};

exports.addCommentByArticleId = (article_id, author, body) => {
  return connection("comments")
    .insert({ article_id, author, body })
    .returning("*")
    .then(commentArr => {
      return commentArr;
    });
};
