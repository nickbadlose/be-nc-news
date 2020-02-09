const usersRouter = require("express").Router();
const {
  getUsers,
  getUserById,
  postUser
} = require("../controllers/users.controller");
const { send405Error } = require("../errors/errors");

usersRouter
  .route("/")
  .get(getUsers)
  .post(postUser)
  .all(send405Error);

usersRouter
  .route("/:username")
  .get(getUserById)
  .all(send405Error);

module.exports = usersRouter;
