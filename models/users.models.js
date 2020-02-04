const connection = require("../db/connection");

exports.fetchUsers = () => {
  return connection("users")
    .select("*")
    .then(users => {
      return users;
    });
};

exports.fetchUserById = username => {
  return connection("users")
    .where({ username })
    .then(user => {
      if (!user.length) {
        return Promise.reject({ status: 404, msg: "Not found!" });
      }
      return user;
    });
};
