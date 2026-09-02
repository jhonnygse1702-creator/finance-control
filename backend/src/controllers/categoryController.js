const categoryService = require("../services/categoryService");

function getAllCategories(req, res) {
    const categories = categoryService.getAllCategories();

    res.json(categories);
}

function getCategoryById(req, res) {
    const { id } = req.params;

    const category = categoryService.getCategoryById(id);

    res.json(category);
}

function createCategory(req, res) {
    const { name, type } = req.body;

    const category = categoryService.createCategory(name, type);

    res.status(201).json(category);
}

function updateCategory(req, res) {
    const { id } = req.params;
    const { name, type } = req.body;

    const category = categoryService.updateCategory(id, name, type);

    res.json(category);
}

function deleteCategory(req, res) {
    const { id } = req.params;

    const result = categoryService.deleteCategory(id);

    res.json(result);
}

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};