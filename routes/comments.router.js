const commentsRouter = require("express").Router();
const {
  patchCommentById,
  deleteCommentById
} = require("../controllers/comments.controllers");
const { send405Error } = require("../errors/errors");

commentsRouter
  .route("/:comment_id")
  .patch(patchCommentById)
  .delete(deleteCommentById)
  .all(send405Error);

module.exports = commentsRouter;
