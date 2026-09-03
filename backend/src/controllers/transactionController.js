const transactionService = require("../services/transactionService");

function getAllTransactions(req, res) {
    const transactions = transactionService.getAllTransactions();

    res.json(transactions);
}

function getTransactionById(req, res) {
    const { id } = req.params;

    const transaction = transactionService.getTransactionById(id);

    res.json(transaction);
}

function createTransaction(req, res) {
    const {
        userId,
        categoryId,
        description,
        amount,
        type,
        transactionDate,
        notes
    } = req.body;

    const transaction = transactionService.createTransaction(
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

    const transaction = transactionService.updateTransaction(
        id,
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

    const result = transactionService.deleteTransaction(id);

    res.json(result);
}

module.exports = {
    getAllTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction
};