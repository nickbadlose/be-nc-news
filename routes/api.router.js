const apiRouter = require("express").Router();
const topicsRouter = require("./topics.router");
const usersRouter = require("./users.router");
const articlesRouter = require("./articles.router");
const commentsRouter = require("./comments.router");
const loginRouter = require("./login.router");
const { getEndpoints, getAll } = require("../controllers/api.controllers");
const { send405Error } = require("../errors/errors");

apiRouter.route("/").get(getEndpoints);

apiRouter.route("/search").get(getAll);

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/users", usersRouter);

apiRouter.use("/articles", articlesRouter);

apiRouter.use("/comments", commentsRouter);

apiRouter.use("/login", loginRouter);

apiRouter.all("/*", send405Error);

module.exports = apiRouter;
