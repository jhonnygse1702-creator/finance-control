const categoryService = require("../services/categoryService");

function getAllCategories(req, res) {
    const categories = categoryService.getAllCategories();

    res.json(categories);
}

module.exports = {
    getAllCategories
};