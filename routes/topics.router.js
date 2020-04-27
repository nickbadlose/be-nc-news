const topicsRouter = require("express").Router();
const { validateToken } = require("../controllers/authorization.controllers");
const { getTopics, postTopic } = require("../controllers/topics.controllers");

topicsRouter.route("/").get(getTopics);

// authentication below

topicsRouter.route("/").post(validateToken, postTopic);

module.exports = topicsRouter;
