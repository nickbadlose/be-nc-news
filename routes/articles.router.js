const articlesRouter = require("express").Router();
const {
  getArticleById,
  updateArticleById,
  postCommentByArticleId,
  getCommentsByArticleId,
  getArticles,
  postArticle,
  deleteArticleById,
} = require("../controllers/articles.controllers");
const { validateToken } = require("../controllers/authorization.controllers");

articlesRouter.route("/").get(getArticles);

articlesRouter.route("/:article_id/comments").get(getCommentsByArticleId);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(updateArticleById)
  .delete(deleteArticleById);

// validation needed for below routes

articlesRouter.route("/").post(validateToken, postArticle);

articlesRouter
  .route("/:article_id/comments")
  .post(validateToken, postCommentByArticleId);

module.exports = articlesRouter;
