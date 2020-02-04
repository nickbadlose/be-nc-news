const articlesRouter = require("express").Router();
const {
  getArticleById,
  updateArticleById,
  postCommentByArticleId,
  getCommentsByArticleId
} = require("../controllers/articles.controllers");

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(updateArticleById);

module.exports = articlesRouter;
