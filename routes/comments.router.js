const commentsRouter = require("express").Router();
const {
  patchCommentById,
  deleteCommentById,
  getComments,
} = require("../controllers/comments.controllers");

commentsRouter.route("/users/:username").get(getComments);

commentsRouter
  .route("/:comment_id")
  .patch(patchCommentById)
  .delete(deleteCommentById);

module.exports = commentsRouter;
