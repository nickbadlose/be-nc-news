const connection = require("../db/connection");

exports.updateCommentById = (comment_id, votes) => {
  if (votes === undefined) {
    return Promise.reject({ status: 422, msg: "Unprocessable entity!" });
  }
  return connection("comments")
    .where({ comment_id })
    .increment({ votes })
    .returning("*")
    .then(commentArr => {
      if (!commentArr.length) {
        return Promise.reject({ status: 404, msg: "Not found!" });
      }
      return commentArr;
    });
};

exports.removeCommentById = comment_id => {
  return connection("comments")
    .where({ comment_id })
    .del()
    .then(deletedRows => {
      if (deletedRows === 0) {
        return Promise.reject({ status: 404, msg: "Not found!" });
      } else return;
    });
};
