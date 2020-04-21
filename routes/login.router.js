const loginRouter = require("express").Router();
const { sendToken } = require("../controllers/authorization.controllers");

loginRouter.route("/").post(sendToken);

module.exports = loginRouter;
