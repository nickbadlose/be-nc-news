const endpoints = require("../endpoints.json");

// const enpoints =

// const stringyEndpoints = JSON.stringify(endpoints);

// console.log(JSON.stringify(endpoints));

// console.log(JSON.parse(stringyEndpoints));

// console.log(endpoints["GET /api/topics"].exampleResponse.topics);

exports.getEndpoints = (req, res, next) => {
  console.log("hello");
  res.status(200).send(endpoints);
};
