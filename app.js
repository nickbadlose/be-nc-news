const express = require("express");
const app = express();
const apiRouter = require("./routes/api.router");
const { pSQLErrors, generalErrors } = require("./errors/errors");

app.use(express.json());

app.use("/api", apiRouter);

app.use(pSQLErrors);

app.use(generalErrors);

module.exports = app;
