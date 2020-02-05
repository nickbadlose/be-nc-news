const articlesRouter = require("express").Router();
const {
  getArticleById,
  updateArticleById,
  postCommentByArticleId,
  getCommentsByArticleId,
  getArticles
} = require("../controllers/articles.controllers");

articlesRouter.route("/").get(getArticles);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(updateArticleById);

module.exports = articlesRouter;
