process.env.NODE_ENV = "test";
const chai = require("chai");
const request = require("supertest");
const { expect } = chai;
const connection = require("../db/connection");
const app = require("../app");
const samsChaiSorted = require("sams-chai-sorted");

chai.use(samsChaiSorted);

describe("/api", () => {
  after(() => connection.destroy());
  beforeEach(() => connection.seed.run());

  describe("/theEndPointThatWasnt", () => {
    it("GET: returns 404 Not found! when passed an endpoint that doesn't exist", () => {
      return request(app)
        .get("/api/#notanendpoint")
        .expect(404);
    });
  });

  describe("/topics", () => {
    describe("GET", () => {
      it("GET: returns 200 and an object with a key of topics containing an array of topics", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(body).to.contain.keys("topics");
            body.topics.forEach(topic => {
              expect(topic).to.contain.keys("slug", "description");
            });
          });
      });
    });
  });

  describe("/users", () => {
    describe("GET", () => {
      it("GET: returns 200 and an object with a key of users containing an array of user objects", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body }) => {
            expect(body).to.contain.keys("users");
            body.users.forEach(user => {
              expect(user).to.contain.keys("username", "avatar_url", "name");
            });
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
              expect(body.username).to.equal("butter_bridge");
              expect(body).to.contain.keys("username", "avatar_url", "name");
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
    describe("GET", () => {
      it("GET: returns 200 and an object with a key of articles containing an array of all the articles", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body).to.contain.keys("articles");
            body.articles.forEach(article => {
              return expect(article).to.contain.keys(
                "author",
                "title",
                "article_id",
                "topic",
                "created_at",
                "votes",
                "comment_count"
              );
            });
          });
      });
      it("GET: returns the articles sorted by created_at by default and ordered by descending by default", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.sortedBy("created_at", {
              descending: true
            });
          });
      });
      it("GET: returns the articles sorted by the passed sort_by query", () => {
        return request(app)
          .get("/api/articles?sort_by=article_id")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.sortedBy("article_id", { descending: true });
          });
      });
      it("returns 406 Invalid request when passed a sort_by query that doesn't exist", () => {
        return request(app)
          .get("/api/articles?sort_by=cantSortThis!")
          .expect(406)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Invalid request!");
          });
      });
      it("GET: returns the articles ordered by the passed order query", () => {
        return request(app)
          .get("/api/articles?order=asc")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.sortedBy("created_at", {
              descending: false
            });
          });
      });
      it("returns 406 Invalid request when passed a order query that doesn't exist", () => {
        return request(app)
          .get("/api/articles?order=cantOrderThis!")
          .expect(406)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Invalid request!");
          });
      });
      it("GET: returns the articles filtered by the passed username query", () => {
        return request(app)
          .get("/api/articles?username=butter_bridge")
          .expect(200)
          .then(({ body: { articles } }) => {
            const output = articles.every(article => {
              return article.author === "butter_bridge";
            });
            expect(output).to.be.true;
          });
      });
      it("returns 406 Invalid request when passed a username query that doesn't exist", () => {
        return request(app)
          .get("/api/articles?username=notAUser")
          .expect(406)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Invalid request!");
          });
      });
      it("returns 200 and an object with an articles key containing an empty array when passed a valid username that has not wrote any articles", () => {
        return request(app)
          .get("/api/articles?username=lurker")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).to.equal(0);
          });
      });
      it("GET: returns the articles filtered by the passed topic query", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body: { articles } }) => {
            const output = articles.every(article => {
              return article.topic === "mitch";
            });
            expect(output).to.be.true;
          });
      });
      it("returns 406 Invalid request when passed a topic query that doesn't exist", () => {
        return request(app)
          .get("/api/articles?topic=notATopic")
          .expect(406)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Invalid request!");
          });
      });
      it("returns 200 and an object with an articles key containing an empty array when passed a valid topic that has not wrote any articles", () => {
        return request(app)
          .get("/api/articles?topic=paper")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).to.equal(0);
          });
      });
    });

    describe("/:article_id", () => {
      describe("GET", () => {
        it("GET: returns 200 and an object containing an article relating to the passed article_id", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body }) => {
              expect(body.article_id).to.equal(1);
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

      describe("/comments", () => {
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
          it("POST: returns 406 Invalid request! when passed an invalid article_id", () => {
            const comment = {
              username: "butter_bridge",
              body: "I'll butter your bridge"
            };
            return request(app)
              .post("/api/articles/abc/comments")
              .send(comment)
              .expect(406)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Invalid request!");
              });
          });
          it("POST: returns 422 Incomplete request! when passed the wrong or no username/body key", () => {
            const comment = {
              hello: "butter_bridge",
              byebye: "I'll butter your bridge"
            };
            return request(app)
              .post("/api/articles/1/comments")
              .send(comment)
              .expect(422)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Incomplete request!");
              });
          });
          it("POST: returns 406 Invalid request! when passed the wrong or no username/body key", () => {
            const comment = {
              username: 111,
              body: ["I'll butter your bridge"]
            };
            return request(app)
              .post("/api/articles/1/comments")
              .send(comment)
              .expect(406)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Invalid request!");
              });
          });
        });

        describe("GET", () => {
          it("GET: returns 200 and an object containing an array of comments for the given article_id", () => {
            return request(app)
              .get("/api/articles/1/comments")
              .expect(200)
              .then(({ body }) => {
                expect(body).to.contain.keys("comments");
                body.comments.forEach(comment => {
                  expect(comment).to.contain.keys(
                    "comment_id",
                    "author",
                    "votes",
                    "created_at",
                    "body"
                  );
                });
              });
          });
          it("GET: returns 200 and an object with a key of comments containing an empty array when passed an article_id referencing an article with no comments", () => {
            return request(app)
              .get("/api/articles/2/comments")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments.length).to.equal(0);
              });
          });
          it("GET: returns 404 Not found! when passed an article_id that doesn't exist", () => {
            return request(app)
              .get("/api/articles/100/comments")
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Not found!");
              });
          });
          it("GET: returns 406 Invalid request! when passed an article_id that doesn't exist", () => {
            return request(app)
              .get("/api/articles/abc/comments")
              .expect(406)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Invalid request!");
              });
          });
          it("GET: returns the comments sorted by created_at by default and ordered by ascending by default", () => {
            return request(app)
              .get("/api/articles/1/comments")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.be.sortedBy("created_at", {
                  descending: false
                });
              });
          });
          it("GET: returns the comments sorted by the passed sort_by query", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=votes")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.be.sortedBy("votes");
              });
          });
          it("GET: returns the comments ordered by the passed order query", () => {
            return request(app)
              .get("/api/articles/1/comments?order=desc")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.be.sorted({ descending: true });
              });
          });
          it("GET: returns 406 Invalid request! when passed a sort_by query that doesn't exist", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=theUnSortAbleMan")
              .expect(406)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Invalid request!");
              });
          });
          it("GET: returns 406 Invalid request! when passed an invalid order query", () => {
            return request(app)
              .get("/api/articles/1/comments?order=theUnOrderAbleMan")
              .expect(406)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Invalid request!");
              });
          });
        });
      });
    });
  });

  describe.only("/comments", () => {
    describe("/:comment_id", () => {
      describe("PATCH", () => {
        it("PATCH: returns 202 and an object containing the updated comment when passed a comment_id", () => {
          const votes = { inc_votes: 1 };
          return request(app)
            .patch("/api/comments/2")
            .send(votes)
            .expect(202)
            .then(({ body }) => {
              expect(body.votes).to.equal(15);
              expect(body.comment_id).to.equal(2);
              expect(body).to.contain.keys(
                "author",
                "article_id",
                "created_at",
                "body"
              );
            });
        });
        it("PATCH: returns 404 Not found! when passed a comment_id that doesn't exist", () => {
          const votes = { inc_votes: 1 };
          return request(app)
            .patch("/api/comments/10000")
            .send(votes)
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Not found!");
            });
        });
        it("PATCH: returns 406 Invalid request! when passed an invalid comment_id", () => {
          const votes = { inc_votes: 1 };
          return request(app)
            .patch("/api/comments/abc")
            .send(votes)
            .expect(406)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Invalid request!");
            });
        });
        it("PATCH: returns 422 Incomplete request! when passed a wrong or no inc_votes key", () => {
          const votes = { hello: 1 };
          return request(app)
            .patch("/api/comments/2")
            .send(votes)
            .expect(422)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Incomplete request!");
            });
        });
        it("PATCH: returns 406 Invalid request! when passed an invalid inc_votes value", () => {
          const votes = { inc_votes: ["abc"] };
          return request(app)
            .patch("/api/comments/2")
            .send(votes)
            .expect(406)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Invalid request!");
            });
        });
      });
      describe("DELETE", () => {
        it("DELETE: returns 204 and no content when removing comment by comment_id", () => {
          return request(app)
            .delete("/api/comments/1")
            .expect(204)
            .then(({ body }) => {
              expect(body).to.eql({});
            });
        });
        it("DELETE: returns 404 Not found! when passed a comment_id that doesn't exist", () => {
          return request(app)
            .delete("/api/comments/100000")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.eql("Not found!");
            });
        });
        it("DELETE: returns 406 Invalid request! when passed an invalid comment_id", () => {
          return request(app)
            .delete("/api/comments/abc")
            .expect(406)
            .then(({ body: { msg } }) => {
              expect(msg).to.eql("Invalid request!");
            });
        });
      });
    });
  });
});
