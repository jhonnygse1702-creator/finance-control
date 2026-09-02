const express = require("express");

const categoryRoutes = require("./routes/categoryRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "FinanceControl API funcionando!"
    });
});

app.use("/api/categories", categoryRoutes);

app.use(errorHandler);

module.exports = app;