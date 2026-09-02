const express = require("express");

const categoryRoutes = require("./routes/categoryRoutes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "FinanceControl API funcionando!"
    });
});

app.use("/api/categories", categoryRoutes);

module.exports = app;