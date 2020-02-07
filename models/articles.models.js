const connection = require("../db/connection");

exports.fetchArticleById = article_id => {
  return connection("articles")
    .select("articles.*")
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", function() {
      this.on("articles.article_id", "comments.article_id");
    })
    .groupBy("articles.article_id")
    .where("articles.article_id", article_id)
    .then(articleArr => {
      if (!articleArr.length) {
        return Promise.reject({ status: 404, msg: "Not found!" });
      }
      return articleArr;
    });
};

exports.editArticleById = (article_id, votes = 0) => {
  return connection("articles")
    .where({ article_id })
    .increment({ votes })
    .returning("*")
    .then(articleArr => {
      if (!articleArr.length) {
        return Promise.reject({ status: 404, msg: "Not found!" });
      }
      return articleArr;
    });
};

exports.addCommentByArticleId = (article_id, author, body) => {
  if (typeof body !== "string") {
    return Promise.reject({ status: 400, msg: "Bad request!" });
  }
  return connection("comments")
    .insert({ article_id, author, body })
    .returning("*")
    .then(commentArr => {
      return commentArr;
    });
};

exports.fetchCommentsByArticleId = (
  article_id,
  sort_by = "created_at",
  order = "desc"
) => {
  if (order !== "asc" && order !== "desc") {
    return Promise.reject({ status: 400, msg: "Bad request!" });
  }
  const promises = [
    connection("comments")
      .select("comment_id", "votes", "created_at", "author", "body")
      .where({ article_id })
      .orderBy(sort_by, order),
    checkIfArticleExists(article_id)
  ];

  return Promise.all(promises).then(([commentsArr, articlePredicate]) => {
    if (!articlePredicate) {
      return Promise.reject({ status: 404, msg: "Not found!" });
    } else {
      return commentsArr;
    }
  });
};

exports.fetchArticles = (
  sort_by = "created_at",
  order = "desc",
  author,
  topic,
  limit = 10,
  p = 1
) => {
  if (order !== "asc" && order !== "desc") {
    return Promise.reject({ status: 400, msg: "Bad request!" });
  }
  const username = author;
  const promises = [
    connection("articles")
      .count({ total_count: "articles.article_id" })
      .select(
        "articles.author",
        "articles.title",
        "articles.article_id",
        "articles.topic",
        "articles.created_at",
        "articles.votes"
      )
      .leftJoin("comments", "articles.article_id", "comments.article_id")
      .count({ comment_count: "comment_id" })
      .groupBy("articles.article_id")
      .orderBy(sort_by, order)
      .modify(query => {
        if (username) query.where("articles.author", username);
        if (topic) query.where("articles.topic", topic);
      })
      .count({ total_count: "articles.article_id" })
      .limit(limit)
      .offset((p - 1) * 10),
    checkIfUserExists(username),
    checkIfTopicExists(topic),
    getArticleCount(username, topic)
  ];

  return Promise.all(promises).then(
    ([articlesArr, userPredicate, topicPredicate, total_count]) => {
      if (!userPredicate || !topicPredicate) {
        return Promise.reject({ status: 404, msg: "Not found!" });
      }
      const articles = {
        articles: articlesArr,
        total_count: total_count
      };
      return articles;
    }
  );
};

const checkIfUserExists = username => {
  if (username === undefined) return true;
  else {
    return connection("users")
      .select("*")
      .where({ username })
      .then(userArr => {
        if (!userArr.length) return false;
        else return true;
      });
  }
};

const checkIfTopicExists = topic => {
  if (topic === undefined) return true;
  else {
    return connection("topics")
      .select("*")
      .where("slug", topic)
      .then(topicArr => {
        if (!topicArr.length) return false;
        else return true;
      });
  }
};

const checkIfArticleExists = article_id => {
  if (article_id === undefined) return true;
  return connection("articles")
    .select("*")
    .where({ article_id })
    .then(articleArr => {
      if (!articleArr.length) return false;
      else return true;
    });
};

const getArticleCount = (username, topic) => {
  return connection("articles")
    .modify(query => {
      if (username) query.where("articles.author", username);
      if (topic) query.where("articles.topic", topic);
    })
    .count({ total_count: "article_id" })
    .then(([{ total_count }]) => {
      return total_count;
    });
};
