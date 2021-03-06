const bcrypt = require("bcrypt");

exports.formatDates = (list) => {
  return list.map((object) => {
    const newObject = { ...object };
    if (newObject.created_at !== undefined) {
      let date = new Date(newObject.created_at);
      newObject.created_at = date.toJSON();
    }
    return newObject;
  });
};

exports.makeRefObj = (list, key, value) => {
  const refObj = {};
  list.forEach((object) => {
    refObj[object[key]] = object[value];
  });
  return refObj;
};

exports.formatComments = (comments, articleRef, newKey, oldKey) => {
  const dateFormattedComments = this.formatDates(comments);
  return dateFormattedComments.map((comment) => {
    const formattedComment = { ...comment };
    formattedComment[newKey] = articleRef[comment[oldKey]];
    formattedComment.author = formattedComment.created_by;
    delete formattedComment.created_by;
    delete formattedComment[oldKey];
    return formattedComment;
  });
};

exports.formatUsers = (rawUsers) => {
  return rawUsers.map((user) => ({
    ...user,
    password: bcrypt.hashSync(user.password, 10),
  }));
};
