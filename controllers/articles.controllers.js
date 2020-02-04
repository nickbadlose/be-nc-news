const {
  fetchArticleById,
  editArticleById,
  addCommentByArticleId
} = require("../models/articles.models");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then(article => {
      res.status(200).send(article);
    })
    .catch(err => {
      next(err);
    });
};

exports.updateArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  editArticleById(article_id, inc_votes)
    .then(([article]) => {
      res.status(202).send(article);
    })
    .catch(err => {
      next(err);
    });
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  addCommentByArticleId(article_id, username, body)
    .then(([comment]) => {
      res.status(201).send(comment);
    })
    .catch(err => {
      next(err);
    });
};
