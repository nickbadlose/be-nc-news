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
  if (author === undefined || body === undefined) {
    return Promise.reject({ status: 422, msg: "Incomplete request!" });
  }
  if (typeof body !== "string" || typeof author !== "string") {
    return Promise.reject({ status: 406, msg: "Invalid request!" });
  }
  return connection("comments")
    .insert({ article_id, author, body })
    .returning("*")
    .then(commentArr => {
      return commentArr;
    });
};

exports.fetchCommentsByArticleId = article_id => {
  const promises = [
    connection("comments").where({ article_id }),
    connection("articles").where({ article_id })
  ];
  return Promise.all(promises).then(([commentsArr, articleArr]) => {
    const formattedComments = commentsArr.map(comment => {
      delete comment.article_id;
      return comment;
    });

    if (!commentsArr.length) {
      if (!articleArr.length) {
        return Promise.reject({ status: 404, msg: "Not found!" });
      } else return formattedComments;
    }
    return formattedComments;
  });
};
