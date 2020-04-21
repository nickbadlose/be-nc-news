const usersRouter = require("express").Router();
const {
  getUsers,
  getUserById,
  postUser,
  patchUserById,
} = require("../controllers/users.controller");

usersRouter.route("/").get(getUsers).post(postUser);

usersRouter.route("/:username").get(getUserById).patch(patchUserById);

module.exports = usersRouter;
