const express = require("express");
const app = express();
const apiRouter = require("./routes/api.router");
const { pSQLErrors, generalErrors } = require("./errors/errors");
const cors = require("cors");

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.use(pSQLErrors);

app.use(generalErrors);

module.exports = app;
