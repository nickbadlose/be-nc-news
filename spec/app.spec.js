process.env.NODE_ENV = "test";
const chai = require("chai");
const request = require("supertest");
const { expect } = chai;
const connection = require("../db/connection");
const app = require("../app");

describe("/api", () => {
  after(() => connection.destroy());
  beforeEach(() => connection.seed.run());

  describe("/topics", () => {
    describe("GET", () => {
      it("GET: returns 200 and an object with a key of topics containing an array of topics", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(body).to.contain.keys("topics");
            expect(body.topics[0]).to.contain.keys("slug", "description");
          });
      });
    });
  });

  describe("/username", () => {
    describe("GET", () => {
      it("GET: returns 200 and an object with a key of users containing an array of user objects", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body }) => {
            expect(body).to.contain.keys("users");
            expect(body.users[0]).to.contain.keys(
              "username",
              "avatar_url",
              "name"
            );
          });
      });
    });

    describe("/:username", () => {
      describe("GET", () => {
        it("GET: returns 200 and an object containing the user information of the user with the passed username parameter", () => {
          return request(app)
            .get("/api/users/butter_bridge")
            .expect(200)
            .then(({ body }) => {
              const expected = {
                username: "butter_bridge",
                avatar_url:
                  "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
                name: "jonny"
              };
              expect(body).to.eql(expected);
            });
        });
        it("GET: returns 404 Not found! when passed a username that doesn't exist", () => {
          return request(app)
            .get("/api/users/butter_bridg")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Not found!");
            });
        });
      });
    });
  });

  describe("/articles", () => {
    describe("/:article_id", () => {
      describe("GET", () => {
        it("GET: returns 200 and an object containing an article relating to the passed article_id", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body }) => {
              expect(body).to.contain.keys(
                "article_id",
                "title",
                "body",
                "votes",
                "topic",
                "author",
                "created_at",
                "comment_count"
              );
            });
        });
        it("GET: returns 404 Not found! when passed a non existent article_id", () => {
          return request(app)
            .get("/api/articles/100")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Not found!");
            });
        });
        it("GET: returns 406 Invalid request! when passed an invalid article_id", () => {
          return request(app)
            .get("/api/articles/abc")
            .expect(406)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Invalid request!");
            });
        });
      });

      describe("PATCH", () => {
        it("PATCH: returns 202 and an object containing the updated article when passed an article_id", () => {
          const votes = { inc_votes: 1 };
          const outputArticle = {
            article_id: 1,
            title: "Living in the shadow of a great man",
            body: "I find this existence challenging",
            votes: 101,
            topic: "mitch",
            author: "butter_bridge",
            created_at: "2018-11-15T12:21:54.171Z"
          };
          return request(app)
            .patch("/api/articles/1")
            .send(votes)
            .expect(202)
            .then(({ body }) => {
              expect(body).to.eql(outputArticle);
            });
        });
        it("PATCH: returns 404 Not found! when passed an article_id that doesn't exist", () => {
          const votes = { inc_votes: 1 };
          return request(app)
            .patch("/api/articles/100")
            .send(votes)
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Not found!");
            });
        });
        it("PATCH: returns 406 Invalid request! when passed an invalid article_id", () => {
          const votes = { inc_votes: 1 };
          return request(app)
            .patch("/api/articles/abc")
            .send(votes)
            .expect(406)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Invalid request!");
            });
        });
        it("PATCH: returns 422 Incomplete request! when passed a wrong or no inc_votes key", () => {
          const votes = { hello: 1 };
          return request(app)
            .patch("/api/articles/1")
            .send(votes)
            .expect(422)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Incomplete request!");
            });
        });
        it("PATCH: returns 406 Invalid request! when passed an invalid inc_votes value", () => {
          const votes = { inc_votes: ["abc"] };
          return request(app)
            .patch("/api/articles/1")
            .send(votes)
            .expect(406)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Invalid request!");
            });
        });
      });

      describe.only("/comments", () => {
        describe("POST", () => {
          it("POST: returns 201 and an object containing the posted comment", () => {
            const comment = {
              username: "butter_bridge",
              body: "I'll butter your bridge"
            };
            return request(app)
              .post("/api/articles/1/comments")
              .send(comment)
              .expect(201)
              .then(({ body }) => {
                expect(body).to.contain.keys(
                  "comment_id",
                  "author",
                  "article_id",
                  "votes",
                  "created_at",
                  "body"
                );
              });
          });
          it("POST: returns 404 Not found! when passed an article_id that doesn't exist", () => {
            const comment = {
              username: "butter_bridge",
              body: "I'll butter your bridge"
            };
            return request(app)
              .post("/api/articles/100/comments")
              .send(comment)
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Not found!");
              });
          });
        });
      });
    });
  });
});
