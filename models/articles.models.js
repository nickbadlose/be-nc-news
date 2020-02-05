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

exports.editArticleById = (article_id, votes) => {
  if (votes === undefined) {
    return Promise.reject({ status: 422, msg: "Unprocessable entity!" });
  }
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
  if (author === undefined || body === undefined) {
    return Promise.reject({ status: 422, msg: "Unprocessable entity!" });
  }
  if (typeof body !== "string" || typeof author !== "string") {
    return Promise.reject({ status: 406, msg: "Invalid request!" });
  }
  return connection("comments")
    .insert({ article_id, author, body })
    .returning("*")
    .then(commentArr => {
      return commentArr;
    });
};

exports.fetchCommentsByArticleId = (article_id, { sort_by, order }) => {
  if (sort_by === undefined) sort_by = "created_at";
  if (order === undefined) order = "asc";
  if (order !== "asc" && order !== "desc") {
    return Promise.reject({ status: 406, msg: "Invalid request!" });
  }
  const promises = [
    connection("comments")
      .where({ article_id })
      .orderBy(sort_by, order),
    connection("articles").where({ article_id })
  ];
  return Promise.all(promises).then(([commentsArr, articleArr]) => {
    const formattedComments = commentsArr.map(comment => {
      delete comment.article_id;
      return comment;
    });

    if (!commentsArr.length) {
      if (!articleArr.length) {
        return Promise.reject({ status: 404, msg: "Not found!" });
      } else return formattedComments;
    }
    return formattedComments;
  });
};

exports.fetchArticles = ({ sort_by, order, username, topic }) => {
  if (sort_by === undefined) sort_by = "created_at";
  if (order === undefined) order = "desc";
  if (order !== "asc" && order !== "desc") {
    return Promise.reject({ status: 406, msg: "Invalid request!" });
  }
  const promises = [
    connection("articles")
      .select("articles.*")
      .leftJoin("comments", "articles.article_id", "comments.article_id")
      .count({ comment_count: "comment_id" })
      .groupBy("articles.article_id")
      .orderBy(sort_by, order)
      .modify(query => {
        if (username) query.where("articles.author", username);
        if (topic) query.where("articles.topic", topic);
      }),
    checkIfUserExists(username),
    checkIfTopicExists(topic)
  ];

  return Promise.all(promises).then(
    ([articlesArr, userPredicate, topicPredicate]) => {
      if (!userPredicate || !topicPredicate) {
        return Promise.reject({ status: 404, msg: "Not found!" });
      }
      return articlesArr;
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
      .then(userArr => {
        if (!userArr.length) return false;
        else return true;
      });
  }
};
