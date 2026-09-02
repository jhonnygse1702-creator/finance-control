const express = require("express");

const path = require("path");

const categoryRoutes = require("./routes/categoryRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "../../frontend")));

app.use("/api/categories", categoryRoutes);

app.use(errorHandler);

module.exports = app;