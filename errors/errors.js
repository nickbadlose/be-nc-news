exports.pSQLErrors = (err, req, res, next) => {
  if (err.code) {
    // console.log("in pSQLErrors:", err.code);
    const errRef = {
      "22P02": { status: 406, msg: "Invalid request!" },
      "23503": { status: 404, msg: "Not found!" },
      "42703": { status: 406, msg: "Invalid request!" },
      "23502": { status: 422, msg: "Unprocessable entity!" }
    };
    if (errRef[err.code] === undefined) {
      res.status(404).send({ msg: "General error!" });
    }
    res.status(errRef[err.code].status).send({ msg: errRef[err.code].msg });
  } else next(err);
};

exports.generalErrors = (err, req, res, next) => {
  const { status, msg } = err;
  // console.log("in general errors:", err);
  res.status(status).send({ msg });
};

exports.send405Error = (req, res, next) => {
  res.status(405).send({ msg: "method not allowed" });
};
