const usersRouter = require("express").Router();
const { getUsers, getUserById } = require("../controllers/users.controller");
const { send405Error } = require("../errors/errors");

usersRouter
  .route("/")
  .get(getUsers)
  .all(send405Error);

usersRouter
  .route("/:username")
  .get(getUserById)
  .all(send405Error);

module.exports = usersRouter;
