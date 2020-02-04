const articlesRouter = require("express").Router();
const {
  getArticleById,
  updateArticleById,
  postCommentByArticleId
} = require("../controllers/articles.controllers");

articlesRouter.route("/:article_id/comments").post(postCommentByArticleId);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(updateArticleById);

module.exports = articlesRouter;
