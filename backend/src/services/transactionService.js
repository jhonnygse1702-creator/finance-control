const transactionRepository = require("../repositories/transactionRepository");
const categoryRepository = require("../repositories/categoryRepository");

function isValidDate(dateString) {
    if (
        typeof dateString !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(dateString)
    ) {
        return false;
    }

    const [year, month, day] =
        dateString.split("-").map(Number);

    const date = new Date(
        Date.UTC(
            year,
            month - 1,
            day
        )
    );

    return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day
    );
}

function validateTransactionData(
    categoryId,
    description,
    amount,
    type,
    transactionDate
) {
    if (!categoryId) {
        const error = new Error("A categoria é obrigatória.");
        error.statusCode = 400;
        throw error;
    }

    if (
        !description ||
        typeof description !== "string" ||
        description.trim() === ""
    ) {
        const error = new Error("A descrição é obrigatória.");
        error.statusCode = 400;
        throw error;
    }

    if (
        amount === undefined ||
        amount === null ||
        amount === ""
    ) {
        const error = new Error("O valor é obrigatório.");
        error.statusCode = 400;
        throw error;
    }

    const numericAmount = Number(amount);

    if (
        !Number.isFinite(numericAmount) ||
        numericAmount <= 0
    ) {
        const error = new Error(
            "O valor deve ser maior que zero."
        );

        error.statusCode = 400;
        throw error;
    }

    if (
        !type ||
        !["income", "expense"].includes(type)
    ) {
        const error = new Error(
            "O tipo deve ser 'income' ou 'expense'."
        );

        error.statusCode = 400;
        throw error;
    }

    if (
        !transactionDate ||
        typeof transactionDate !== "string"
    ) {
        const error = new Error(
            "A data da transação é obrigatória."
        );

        error.statusCode = 400;
        throw error;
    }

    if (!isValidDate(transactionDate)) {
        const error = new Error(
            "A data da transação é inválida. Use o formato YYYY-MM-DD."
        );

        error.statusCode = 400;
        throw error;
    }

    const category =
        categoryRepository.findById(categoryId);

    if (!category) {
        const error = new Error(
            "Categoria não encontrada."
        );

        error.statusCode = 404;
        throw error;
    }

    if (category.type !== type) {
        const error = new Error(
            "O tipo da transação deve ser igual ao tipo da categoria."
        );

        error.statusCode = 400;
        throw error;
    }

    return {
        categoryId,
        description: description.trim(),
        amount: numericAmount,
        type,
        transactionDate,
        category
    };
}

function getAllTransactions(userId) {
    if (!userId) {
        const error = new Error(
            "O usuário é obrigatório."
        );

        error.statusCode = 400;
        throw error;
    }

    return transactionRepository.findAll(userId);
}

function getTransactionById(id, userId) {
    if (!userId) {
        const error = new Error(
            "O usuário é obrigatório."
        );

        error.statusCode = 400;
        throw error;
    }

    const transaction =
        transactionRepository.findById(
            id,
            userId
        );

    if (!transaction) {
        const error = new Error(
            "Transação não encontrada."
        );

        error.statusCode = 404;
        throw error;
    }

    return transaction;
}

function createTransaction(
    userId,
    categoryId,
    description,
    amount,
    type,
    transactionDate,
    notes
) {
    if (!userId) {
        const error = new Error(
            "O usuário é obrigatório."
        );

        error.statusCode = 400;
        throw error;
    }

    const validatedData =
        validateTransactionData(
            categoryId,
            description,
            amount,
            type,
            transactionDate
        );

    const result =
        transactionRepository.create(
            userId,
            validatedData.categoryId,
            validatedData.description,
            validatedData.amount,
            validatedData.type,
            validatedData.transactionDate,
            notes
        );

    return transactionRepository.findById(
        result.id,
        userId
    );
}

function updateTransaction(
    id,
    userId,
    categoryId,
    description,
    amount,
    type,
    transactionDate,
    notes
) {
    if (!userId) {
        const error = new Error(
            "O usuário é obrigatório."
        );

        error.statusCode = 400;
        throw error;
    }

    const transaction =
        transactionRepository.findById(
            id,
            userId
        );

    if (!transaction) {
        const error = new Error(
            "Transação não encontrada."
        );

        error.statusCode = 404;
        throw error;
    }

    const validatedData =
        validateTransactionData(
            categoryId,
            description,
            amount,
            type,
            transactionDate
        );

    transactionRepository.update(
        id,
        userId,
        validatedData.categoryId,
        validatedData.description,
        validatedData.amount,
        validatedData.type,
        validatedData.transactionDate,
        notes
    );

    return transactionRepository.findById(
        id,
        userId
    );
}

function deleteTransaction(id, userId) {
    if (!userId) {
        const error = new Error(
            "O usuário é obrigatório."
        );

        error.statusCode = 400;
        throw error;
    }

    const transaction =
        transactionRepository.findById(
            id,
            userId
        );

    if (!transaction) {
        const error = new Error(
            "Transação não encontrada."
        );

        error.statusCode = 404;
        throw error;
    }

    transactionRepository.remove(
        id,
        userId
    );

    return {
        message: "Transação excluída com sucesso."
    };
}

module.exports = {
    getAllTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction
};