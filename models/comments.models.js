const connection = require("../db/connection");

exports.updateCommentById = (comment_id, votes, body) => {
  if (typeof body !== "string" && body) {
    return Promise.reject({ status: 400, msg: "Bad request!" });
  }
  return connection("comments")
    .where({ comment_id })
    .modify((query) => {
      if (body) {
        query.update({ body });
      }
      if (votes) {
        query.increment({ votes });
      }
    })
    .returning("*")
    .then((commentArr) => {
      if (!commentArr.length) {
        return Promise.reject({ status: 404, msg: "Not found!" });
      }
      return commentArr;
    });
};

exports.fetchComments = (author) => {
  return connection("comments")
    .select("comments.*", "articles.title")
    .where("comments.author", author)
    .leftJoin("articles", "comments.article_id", "articles.article_id")
    .then((comments) => {
      return comments;
    });
};

exports.removeCommentById = (comment_id) => {
  return connection("comments")
    .where({ comment_id })
    .del()
    .then((deletedRows) => {
      if (deletedRows === 0) {
        return Promise.reject({ status: 404, msg: "Not found!" });
      } else return;
    });
};
