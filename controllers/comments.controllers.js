const {
  updateCommentById,
  removeCommentById,
  fetchComments,
} = require("../models/comments.models");

exports.patchCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes, body } = req.body;
  updateCommentById(comment_id, inc_votes, body)
    .then(([comment]) => {
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.getComments = (req, res, next) => {
  const { username } = req.params;
  fetchComments(username)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
