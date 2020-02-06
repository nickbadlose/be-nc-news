const {
  updateCommentById,
  removeCommentById
} = require("../models/comments.models");

exports.patchCommentById = (req, res, next) => {
  // if (Object.keys(req.body).length > 1) {
  //   next({ status: 422, msg: "Unprocessable entity!" });
  // }
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updateCommentById(comment_id, inc_votes)
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
