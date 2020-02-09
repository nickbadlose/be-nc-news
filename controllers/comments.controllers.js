const {
  updateCommentById,
  removeCommentById
} = require("../models/comments.models");

exports.patchCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes, body } = req.body;
  updateCommentById(comment_id, inc_votes, body)
    .then(([comment]) => {
      res.status(200).send({ comment });
    })
    .catch(err => {
      next(err);
    });
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(err => {
      next(err);
    });
};
