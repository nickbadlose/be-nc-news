exports.pSQLErrors = (err, req, res, next) => {
  if (err.code) {
    console.log("in pSQLErrors:", err.code);
    const errRef = {
      "22P02": { status: 406, msg: "Invalid request!" },
      "23503": { status: 404, msg: "Not found!" }
    };
    res.status(errRef[err.code].status).send({ msg: errRef[err.code].msg });
  } else next(err);
};

exports.generalErrors = (err, req, res, next) => {
  const { status, msg } = err;
  console.log("in general errors:", err);
  res.status(status).send({ msg });
};
