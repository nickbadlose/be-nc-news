const { loginUser } = require("../models/authorization.models");

exports.postLogin = (req, res, next) => {
  const { username, password } = req.body;
  loginUser(username, password).then((data) => {
    console.log(data, "xxxxxxxxxx");
  });
};
