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

exports.addUser = (username, avatar_url, name) => {
  if (
    typeof username !== "string" ||
    typeof avatar_url !== "string" ||
    typeof name !== "string"
  ) {
    return Promise.reject({ status: 400, msg: "Bad request!" });
  }

  return connection("users")
    .insert({ username, avatar_url, name })
    .returning("*")
    .then(([user]) => {
      return user;
    });
};

exports.updateUserById = (username, avatar_url, name) => {
  if (typeof avatar_url !== "string" && avatar_url) {
    return Promise.reject({ status: 400, msg: "Bad request!" });
  }
  if (typeof name !== "string" && name) {
    return Promise.reject({ status: 400, msg: "Bad request!" });
  }
  return connection("users")
    .where({ username })
    .modify(query => {
      if (avatar_url !== undefined && name !== undefined) {
        query.update({ avatar_url, name });
      }
      if (avatar_url !== undefined && name === undefined) {
        query.update({ avatar_url });
      }
      if (name !== undefined && avatar_url === undefined) {
        query.update({ name });
      }
    })
    .returning("*")
    .then(userArr => {
      if (!userArr.length) {
        return Promise.reject({ status: 404, msg: "Not found!" });
      }
      return userArr;
    });
};
