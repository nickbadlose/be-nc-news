const loginRouter = require("express").Router();
const { postLogin } = require("../controllers/authorization.controllers");

loginRouter.route("/login").post(postLogin);

module.exports = loginRouter;
