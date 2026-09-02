const categoryRepository = require("../repositories/categoryRepository");

function getAllCategories() {
    return categoryRepository.findAll();
}

module.exports = {
    getAllCategories
};