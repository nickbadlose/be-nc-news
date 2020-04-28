const endpoints = require("../endpoints.json");
const { fetchAll } = require("../models/api.models");

exports.getEndpoints = (req, res, next) => {
  res.status(200).send({ endpoints });
};

exports.getAll = (req, res, next) => {
  const { search } = req.query;
  fetchAll(search.toLowerCase())
    .then((data) => {
      console.log(data);
      res.status(200).send(data);
    })
    .catch((err) => {
      next({ status: 404, msg: "Not Found!" });
    });
};
