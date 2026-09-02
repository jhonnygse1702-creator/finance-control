const categoryRepository = require("../repositories/categoryRepository");

function getAllCategories() {
    return categoryRepository.findAll();
}

function getCategoryById(id) {
    const category = categoryRepository.findById(id);

    if (!category) {
        const error = new Error("Categoria não encontrada.");
        error.statusCode = 404;

        throw error;
    }

    return category;
}

function updateCategory(id, name, type) {
    if (!name || typeof name !== "string" || name.trim() === "") {
        const error = new Error("O nome da categoria é obrigatório.");
        error.statusCode = 400;

        throw error;
    }

    if (!type || !["income", "expense"].includes(type)) {
        const error = new Error("O tipo deve ser 'income' ou 'expense'.");
        error.statusCode = 400;

        throw error;
    }

    const category = categoryRepository.findById(id);

    if (!category) {
        const error = new Error("Categoria não encontrada.");
        error.statusCode = 404;

        throw error;
    }

    categoryRepository.update(id, name.trim(), type);

    return categoryRepository.findById(id);
}

function createCategory(name, type) {
    if (!name || typeof name !== "string" || name.trim() === "") {
        const error = new Error("O nome da categoria é obrigatório.");
        error.statusCode = 400;

        throw error;
    }

    if (!type || !["income", "expense"].includes(type)) {
        const error = new Error("O tipo deve ser 'income' ou 'expense'.");
        error.statusCode = 400;

        throw error;
    }

    return categoryRepository.create(name.trim(), type);
}

function deleteCategory(id) {
    const category = categoryRepository.findById(id);

    if (!category) {
        const error = new Error("Categoria não encontrada.");
        error.statusCode = 404;

        throw error;
    }

    categoryRepository.remove(id);

    return {
        message: "Categoria excluída com sucesso."
    };
}

module.exports = {
    getAllCategories,
    getCategoryById,
    updateCategory,
    createCategory,
    deleteCategory
};