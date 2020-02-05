const articlesRouter = require("express").Router();
const {
  getArticleById,
  updateArticleById,
  postCommentByArticleId,
  getCommentsByArticleId,
  getArticles
} = require("../controllers/articles.controllers");
const { send405Error } = require("../errors/errors");

articlesRouter
  .route("/")
  .get(getArticles)
  .all(send405Error);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId)
  .all(send405Error);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(updateArticleById)
  .all(send405Error);

module.exports = articlesRouter;
