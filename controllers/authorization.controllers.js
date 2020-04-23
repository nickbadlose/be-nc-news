const connection = require("../db/connection");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const bcrypt = require("bcrypt");

exports.sendToken = (req, res, next) => {
  const { username, password } = req.body;
  return connection
    .select("*")
    .from("users")
    .where({ username })
    .then(([user]) => {
      if (!user) {
        next({ status: 401, msg: "invalid username or password" });
      } else {
        return Promise.all([bcrypt.compare(password, user.password), user]);
      }
    })
    .then(([passwordOk, user]) => {
      if (user && passwordOk) {
        const token = jwt.sign(
          { user: user.username, iat: Date.now() },
          JWT_SECRET
        );
        res.send({ token });
      } else {
        next({ status: 401, msg: "invalid username or password" });
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
