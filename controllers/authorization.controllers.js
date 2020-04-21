const connection = require("../db/connection");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const bcrypt = require("bcrypt");

exports.sendToken = (req, res, next) => {
  const { username, password } = req.body;

  return connection("users")
    .select("*")
    .where({ username })
    .then(([user]) => {
      if (!user || password !== user.password) {
        next({ status: 401, msg: "invalid username or password" });
      } else {
        const token = jwt.sign(
          {
            user: user.username,
            iat: Date.now(),
          },
          JWT_SECRET
        );
        res.status(200).send({ token });
      }
    })
    .catch(next);
};

exports.validateToken = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    next({ status: 401, msg: "unauthorised" });
  } else {
    const token = authorization.split(" ")[1];
    jwt.verify(token, JWT_SECRET, (err, res) => {
      if (err) next({ status: 401, msg: "unauthorised" });
      else next();
    });
  }
};
