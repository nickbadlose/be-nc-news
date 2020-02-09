process.env.NODE_ENV = "test";
const chai = require("chai");
const request = require("supertest");
const { expect } = chai;
const connection = require("../db/connection");
const app = require("../app");
const samsChaiSorted = require("sams-chai-sorted");
const endpoints = require("../endpoints.json");

chai.use(samsChaiSorted);

describe("/api", () => {
  after(() => connection.destroy());
  beforeEach(() => connection.seed.run());

  describe("GET", () => {
    it("GET: returns 200 and an endpoints object containing all the possible endpoints for the api", () => {
      return request(app)
        .get("/api/")
        .expect(200)
        .then(({ body }) => {
          expect(body).to.contain.keys("endpoints");
          expect(body.endpoints).to.eql(endpoints);
        });
    });
  });

  describe("/theEndPointThatWasnt", () => {
    it("GET: returns 404 Not found! when passed an endpoint that doesn't exist", () => {
      return request(app)
        .get("/api/notanendpoint")
        .expect(404);
    });
  });

  describe("INVALID METHODS", () => {
    it("status:405", () => {
      const invalidMethods = ["patch", "post", "put", "delete"];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]("/api/")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("method not allowed");
          });
      });
      return Promise.all(methodPromises);
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

    describe("INVALID METHODS", () => {
      it("status:405", () => {
        const invalidMethods = ["patch", "post", "put", "delete"];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            [method]("/api/topics")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("method not allowed");
            });
        });
        return Promise.all(methodPromises);
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

    describe("INVALID METHODS", () => {
      it("status:405", () => {
        const invalidMethods = ["patch", "post", "put", "delete"];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            [method]("/api/users")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
    });

    describe("/:username", () => {
      describe("GET", () => {
        it("GET: returns 200 and an object containing the user information of the user with the passed username parameter", () => {
          return request(app)
            .get("/api/users/butter_bridge")
            .expect(200)
            .then(({ body }) => {
              expect(body).to.contain.keys("user");
              expect(body.user.username).to.equal("butter_bridge");
              expect(body.user).to.contain.keys(
                "username",
                "avatar_url",
                "name"
              );
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

      describe("INVALID METHODS", () => {
        it("status:405", () => {
          const invalidMethods = ["patch", "post", "put", "delete"];
          const methodPromises = invalidMethods.map(method => {
            return request(app)
              [method]("/api/users/butter_bridge")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("method not allowed");
              });
          });
          return Promise.all(methodPromises);
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
      it("GET: returns 400 Bad request when passed an invalid sort_by query", () => {
        return request(app)
          .get("/api/articles?sort_by=cantSortThis!")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request!");
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
      it("GET: returns 400 Bad request when passed an invalid order query", () => {
        return request(app)
          .get("/api/articles?order=cantOrderThis!")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request!");
          });
      });
      it("GET: returns the articles filtered by the passed author query", () => {
        return request(app)
          .get("/api/articles?author=butter_bridge")
          .expect(200)
          .then(({ body: { articles } }) => {
            const output = articles.every(article => {
              return article.author === "butter_bridge";
            });
            expect(output).to.be.true;
          });
      });
      it("GET: returns 404 Not found! when passed an author that doesn't exist", () => {
        return request(app)
          .get("/api/articles?author=notAUser")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Not found!");
          });
      });
      it("GET: returns 200 and an object with an articles key containing an empty array when passed a valid author that has not wrote any articles", () => {
        return request(app)
          .get("/api/articles?author=lurker")
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
      it("GET: returns 404 Not found! when passed a topic query that doesn't exist", () => {
        return request(app)
          .get("/api/articles?topic=notATopic")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Not found!");
          });
      });
      it("GET: returns 200 and an object with an articles key containing an empty array when passed a valid topic that has no articles referencing it", () => {
        return request(app)
          .get("/api/articles?topic=paper")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).to.equal(0);
          });
      });
      it("GET: returns 200 and an object with an articles key containing an array of 10 articles at max by default", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).to.equal(10);
          });
      });
      it("GET: returns 200 and an object with an articles key containing an array of articles of the passed limit query", () => {
        return request(app)
          .get("/api/articles?limit=5")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).to.equal(5);
          });
      });
      it("GET: returns 400 Bad request! when passed an invalid limit query", () => {
        return request(app)
          .get("/api/articles?p=not-a-valid-limit-query")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request!");
          });
      });
      it("GET: returns 200 and an object with an articles key containing an array of articles on the passed page query", () => {
        return request(app)
          .get("/api/articles?p=2")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).to.equal(2);
          });
      });
      it("GET: returns 400 Bad request! when passed an invalid page query", () => {
        return request(app)
          .get("/api/articles?p=not-a-valid-p-query")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request!");
          });
      });
      it("GET: returns 200 and an object with an articles key as well as a total_count key of all the articles regardless of pagnation", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.total_count).to.equal("12");
          });
      });
      it("GET: returns the articles with the total count filtered by the topic/author query", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body }) => {
            expect(body.total_count).to.equal("11");
          });
      });
    });

    describe("POST", () => {
      it("POST: returns 201 and the updated article", () => {
        const newArticle = {
          title: "New article",
          body: "This is a new article",
          topic: "mitch",
          author: "butter_bridge"
        };
        return request(app)
          .post("/api/articles")
          .send(newArticle)
          .expect(201)
          .then(({ body }) => {
            expect(body).to.contain.keys("article");
            expect(body.article).to.contain.keys(
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
      it("POST: returns 404 Not found! when passed a username or topic that doesn't exist", () => {
        const newArticle = {
          title: "New article",
          body: "This is a new article",
          topic: "not a topic",
          author: "not a user"
        };
        return request(app)
          .post("/api/articles")
          .send(newArticle)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Not found!");
          });
      });
      it("POST: returns 400 Bad request! when not passed one of the 4 required keys", () => {
        const newArticle = {};
        return request(app)
          .post("/api/articles")
          .send(newArticle)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request!");
          });
      });
      it("POST: returns 400 Bad request! when passed an invalid body or title input", () => {
        const newArticle = {
          title: ["New article"],
          body: ["This is a new article"],
          topic: "mitch",
          author: "butter_bridge"
        };
        return request(app)
          .post("/api/articles")
          .send(newArticle)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request!");
          });
      });
    });

    describe("INVALID METHODS", () => {
      it("status:405", () => {
        const invalidMethods = ["patch", "put", "delete"];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            [method]("/api/articles")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
    });

    describe("/:article_id", () => {
      describe("GET", () => {
        it("GET: returns 200 and an object containing an article relating to the passed article_id", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body }) => {
              expect(body).to.contain.keys("article");
              expect(body.article.article_id).to.equal(1);
              expect(body.article).to.contain.keys(
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
        it("GET: returns 400 Bad request! when passed an invalid article_id", () => {
          return request(app)
            .get("/api/articles/abc")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad request!");
            });
        });
      });

      describe("PATCH", () => {
        it("PATCH: returns 202 and an object containing the updated article when passed an article_id", () => {
          const votes = { inc_votes: 1 };
          return request(app)
            .patch("/api/articles/1")
            .send(votes)
            .expect(200)
            .then(({ body }) => {
              expect(body).to.contain.keys("article");
              expect(body.article.votes).to.equal(101);
              expect(body.article).to.contain.keys(
                "article_id",
                "title",
                "body",
                "votes",
                "author",
                "created_at",
                "topic"
              );
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
        it("PATCH: returns 400 Bad request! when passed an invalid article_id", () => {
          const votes = { inc_votes: 1 };
          return request(app)
            .patch("/api/articles/abc")
            .send(votes)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad request!");
            });
        });
        it("PATCH: returns 200 and an unedited article when passed a wrong or no inc_votes key", () => {
          const votes = { hello: 1 };
          return request(app)
            .patch("/api/articles/1")
            .send(votes)
            .expect(200)
            .then(({ body }) => {
              expect(body).to.contain.keys("article");
              expect(body.article.article_id).to.equal(1);
              expect(body.article.votes).to.equal(100);
              expect(body.article).to.contain.keys(
                "article_id",
                "title",
                "body",
                "votes",
                "author",
                "created_at",
                "topic"
              );
            });
        });
        it("PATCH: returns 400 Bad request! when passed an invalid inc_votes value", () => {
          const votes = { inc_votes: ["abc"] };
          return request(app)
            .patch("/api/articles/1")
            .send(votes)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad request!");
            });
        });
        it("PATCH: returns 200 and the updated article when passed a body with an inc_votes key but other keys also", () => {
          const votes = { inc_votes: 1, job: "errorHandler" };
          return request(app)
            .patch("/api/articles/1")
            .send(votes)
            .expect(200)
            .then(({ body }) => {
              expect(body).to.contain.keys("article");
              expect(body.article.article_id).to.equal(1);
              expect(body.article.votes).to.equal(101);
              expect(body.article).to.contain.keys(
                "article_id",
                "title",
                "body",
                "votes",
                "author",
                "created_at",
                "topic"
              );
            });
        });
      });

      describe("DELETE", () => {
        it("DELETE returns 204 and no content whilst deleting the article and any comments posted to the article", () => {
          return request(app)
            .delete("/api/articles/1")
            .expect(204)
            .then(({ body }) => {
              expect(body).to.eql({});
              const votes = { inc_votes: 1 };
              const promises = [
                request(app)
                  .get("/api/articles/1")
                  .expect(404),
                request(app)
                  .patch("/api/comments/2")
                  .send(votes)
                  .expect(404) // utilising the error setup on our patch comments route if passed a comment  id that doesn't exist
              ];
              return Promise.all(promises);
            });
        });
        it("DELETE returns 404 Not found! when passed an article id that doesn't exist", () => {
          return request(app)
            .delete("/api/articles/100")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Not found!");
            });
        });
        it("DELETE returns 400 Bad request! when passed an article id that doesn't exist", () => {
          return request(app)
            .delete("/api/articles/abc")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad request!");
            });
        });
      });

      describe("INVALID METHODS", () => {
        it("status:405", () => {
          const invalidMethods = ["post", "put"];
          const methodPromises = invalidMethods.map(method => {
            return request(app)
              [method]("/api/articles/1")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("method not allowed");
              });
          });
          return Promise.all(methodPromises);
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
                expect(body).to.contain.keys("comment");
                expect(body.comment).to.contain.keys(
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
          it("POST: returns 400 Bad request! when passed an invalid article_id", () => {
            const comment = {
              username: "butter_bridge",
              body: "I'll butter your bridge"
            };
            return request(app)
              .post("/api/articles/abc/comments")
              .send(comment)
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Bad request!");
              });
          });
          it("POST: returns 400 Bad request! when passed the wrong or no username/body key", () => {
            const comment = {
              hello: "butter_bridge",
              byebye: "I'll butter your bridge"
            };
            return request(app)
              .post("/api/articles/1/comments")
              .send(comment)
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Bad request!");
              });
          });
          it("POST: returns 400 Bad request! when passed an invalid body value", () => {
            const comment = {
              username: 111,
              body: ["I'll butter your bridge"]
            };
            return request(app)
              .post("/api/articles/1/comments")
              .send(comment)
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Bad request!");
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
          it("GET: returns 400 Bad request! when passed an invalid article_id", () => {
            return request(app)
              .get("/api/articles/abc/comments")
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Bad request!");
              });
          });
          it("GET: returns the comments sorted by created_at by default and ordered by descending by default", () => {
            return request(app)
              .get("/api/articles/1/comments")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.be.sortedBy("created_at", {
                  descending: true
                });
              });
          });
          it("GET: returns the comments sorted by the passed sort_by query", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=votes")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.be.sortedBy("votes", {
                  descending: true
                });
              });
          });
          it("GET: returns the comments ordered by the passed order query", () => {
            return request(app)
              .get("/api/articles/1/comments?order=asc")
              .expect(200)
              .then(({ body }) => {
                expect(body.comments).to.be.sortedBy("created_at", {
                  descending: false
                });
              });
          });
          it("GET: returns 400 Bad request! when passed a sort_by query that doesn't exist", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=theUnSortAbleMan")
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Bad request!");
              });
          });
          it("GET: returns 400 Bad request! when passed an invalid order query", () => {
            return request(app)
              .get("/api/articles/1/comments?order=theUnOrderAbleMan")
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Bad request!");
              });
          });
          it("GET: returns 200 and the comments to the given article limited to 10 by default", () => {
            return request(app)
              .get("/api/articles/1/comments")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments.length).to.equal(10);
              });
          });
          it("GET: returns 200 and the comments to the given article limited to the passed limit query", () => {
            return request(app)
              .get("/api/articles/1/comments?limit=5")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments.length).to.equal(5);
              });
          });
          it("GET: returns 400 Bad request! when passed an invalid limit query", () => {
            return request(app)
              .get("/api/articles/1/comments?limit=not-a-valid-limit-query")
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Bad request!");
              });
          });
          it("GET: returns 200 and the comments to the given article on the page of the passed page query", () => {
            return request(app)
              .get("/api/articles/1/comments?p=2")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments.length).to.equal(3);
              });
          });
          it("GET: returns 400 Bad request! when passed an invalid page query", () => {
            return request(app)
              .get("/api/articles/1/comments?p=not-a-valid-p-query")
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Bad request!");
              });
          });
        });

        describe("INVALID METHODS", () => {
          it("status:405", () => {
            const invalidMethods = ["patch", "put", "delete"];
            const methodPromises = invalidMethods.map(method => {
              return request(app)
                [method]("/api/articles/1/comments")
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal("method not allowed");
                });
            });
            return Promise.all(methodPromises);
          });
        });
      });
    });
  });

  describe("/comments", () => {
    describe("/:comment_id", () => {
      describe("PATCH", () => {
        it("PATCH: returns 200 and an object containing the updated comment when passed a comment_id", () => {
          const votes = { inc_votes: 3 };
          return request(app)
            .patch("/api/comments/2")
            .send(votes)
            .expect(200)
            .then(({ body }) => {
              expect(body).to.contain.keys("comment");
              expect(body.comment.votes).to.equal(17);
              expect(body.comment.comment_id).to.equal(2);
              expect(body.comment).to.contain.keys(
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
        it("PATCH: returns 400 Bad request! when passed an invalid comment_id", () => {
          const votes = { inc_votes: 1 };
          return request(app)
            .patch("/api/comments/abc")
            .send(votes)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad request!");
            });
        });
        it("PATCH: returns 200 and an unedited comment when no inc_votes key passed", () => {
          const votes = { hello: 1 };
          return request(app)
            .patch("/api/comments/2")
            .send(votes)
            .expect(200)
            .then(({ body }) => {
              expect(body).to.contain.keys("comment");
              expect(body.comment.votes).to.equal(14);
            });
        });
        it("PATCH: returns 400 Bad request! when passed an invalid inc_votes value", () => {
          const votes = { inc_votes: ["abc"] };
          return request(app)
            .patch("/api/comments/2")
            .send(votes)
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad request!");
            });
        });
        it("PATCH: returns 200 and the updated comment when passed a body with an inc_votes key but other keys also", () => {
          const votes = { inc_votes: 1, job: "errorHandler" };
          return request(app)
            .patch("/api/comments/2")
            .send(votes)
            .expect(200)
            .then(({ body }) => {
              expect(body).to.contain.keys("comment");
              expect(body.comment.votes).to.equal(15);
              expect(body.comment.comment_id).to.equal(2);
              expect(body.comment).to.contain.keys(
                "author",
                "article_id",
                "created_at",
                "body"
              );
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
        it("DELETE: returns 400 Bad request! when passed an invalid comment_id", () => {
          return request(app)
            .delete("/api/comments/abc")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.eql("Bad request!");
            });
        });
      });

      describe("INVALID METHODS", () => {
        it("status:405", () => {
          const invalidMethods = ["get", "post", "put"];
          const methodPromises = invalidMethods.map(method => {
            return request(app)
              [method]("/api/comments/2")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("method not allowed");
              });
          });
          return Promise.all(methodPromises);
        });
      });
    });
  });
});
