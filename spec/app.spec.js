process.env.NODE_ENV = "test";
const chai = require("chai");
const request = require("supertest");
const { expect } = chai;
const connection = require("../db/connection");
const app = require("../app");

after(() => {
  connection.destroy();
});

describe("/api/topics", () => {
  it("GET returns 200 and an object with a key of topics containing an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(topics => {});
  });
});
