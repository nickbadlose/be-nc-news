const usersRouter = require("express").Router();
const {
  getUsers,
  getUserById,
  postUser,
  patchUserById
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
  .patch(patchUserById)
  .all(send405Error);

module.exports = usersRouter;
