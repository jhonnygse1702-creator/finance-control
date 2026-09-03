const dashboardRepository = require("../repositories/dashboardRepository");

function getFinancialSummary() {
    const summary = dashboardRepository.getSummary();

    const totalIncome = Number(summary.total_income);
    const totalExpense = Number(summary.total_expense);

    const balance = totalIncome - totalExpense;

    return {
        total_income: totalIncome,
        total_expense: totalExpense,
        balance
    };
}

module.exports = {
    getFinancialSummary
};