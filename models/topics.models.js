const connection = require("../db/connection");

exports.fetchTopics = () => {
  return connection("topics")
    .select("*")
    .then(topics => {
      return topics;
    });
};
