const connection = require("../db/connection");

exports.loginUser = (ussername, password) => {
  return connection("users")
    .select("*")
    .where({ username })
    .then(([user]) => {
      if (!user || password !== user.password) {
        next({ status: 401, msg: "invalid username or password" });
      } else {
      }
    });
};
