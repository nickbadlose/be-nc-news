const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/topics.controllers");

topicsRouter.route("/").get(getTopics, () => {
  console.log("in topics router");
});

module.exports = topicsRouter;
