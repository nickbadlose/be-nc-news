const {
  fetchUsers,
  fetchUserById,
  addUser,
  updateUserById,
} = require("../models/users.models");

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUserById = (req, res, next) => {
  const { username } = req.params;
  fetchUserById(username)
    .then(([user]) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postUser = (req, res, next) => {
  const { username, avatar_url, name, password } = req.body;
  addUser(username, avatar_url, name, password)
    .then((user) => {
      res.status(201).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchUserById = (req, res, next) => {
  const { username } = req.params;
  const { avatar_url, name } = req.body;
  updateUserById(username, avatar_url, name)
    .then(([user]) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};
