const { fetchTopics, addTopic } = require("../models/topics.models");

exports.getTopics = (req, res, next) => {
  const { slug } = req.query;
  fetchTopics(slug)
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postTopic = (req, res, next) => {
  const { slug, description, image } = req.body;
  addTopic(slug, description, image)
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch((err) => {
      next(err);
    });
};
