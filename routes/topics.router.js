const topicsRouter = require("express").Router();
const { getTopics, postTopic } = require("../controllers/topics.controllers");
const { send405Error } = require("../errors/errors");

topicsRouter
  .route("/")
  .get(getTopics)
  .post(postTopic)
  .all(send405Error);

module.exports = topicsRouter;
