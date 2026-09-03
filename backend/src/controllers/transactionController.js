const transactionService = require("../services/transactionService");

function getAllTransactions(req, res) {
    const userId = req.user.id;

    const transactions =
        transactionService.getAllTransactions(userId);

    res.json(transactions);
}

function getTransactionById(req, res) {
    const { id } = req.params;

    const userId = req.user.id;

    const transaction =
        transactionService.getTransactionById(
            id,
            userId
        );

    res.json(transaction);
}

function createTransaction(req, res) {
    const {
        categoryId,
        description,
        amount,
        type,
        transactionDate,
        notes
    } = req.body;

    const userId = req.user.id;

    const transaction =
        transactionService.createTransaction(
            userId,
            categoryId,
            description,
            amount,
            type,
            transactionDate,
            notes
        );

    res.status(201).json(transaction);
}

function updateTransaction(req, res) {
    const { id } = req.params;

    const {
        categoryId,
        description,
        amount,
        type,
        transactionDate,
        notes
    } = req.body;

    const userId = req.user.id;

    const transaction =
        transactionService.updateTransaction(
            id,
            userId,
            categoryId,
            description,
            amount,
            type,
            transactionDate,
            notes
        );

    res.json(transaction);
}

function deleteTransaction(req, res) {
    const { id } = req.params;

    const userId = req.user.id;

    const result =
        transactionService.deleteTransaction(
            id,
            userId
        );

    res.json(result);
}

module.exports = {
    getAllTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction
};