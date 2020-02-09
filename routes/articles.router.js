const articlesRouter = require("express").Router();
const {
  getArticleById,
  updateArticleById,
  postCommentByArticleId,
  getCommentsByArticleId,
  getArticles,
  postArticle,
  deleteArticleById
} = require("../controllers/articles.controllers");
const { send405Error } = require("../errors/errors");

articlesRouter
  .route("/")
  .get(getArticles)
  .post(postArticle)
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
  .delete(deleteArticleById)
  .all(send405Error);

module.exports = articlesRouter;
