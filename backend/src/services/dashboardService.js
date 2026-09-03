const dashboardRepository = require("../repositories/dashboardRepository");

function getFinancialSummary(month) {
    if (!month) {
        const error = new Error(
            "O mês é obrigatório. Informe no formato YYYY-MM."
        );

        error.statusCode = 400;

        throw error;
    }

    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
        const error = new Error(
            "O mês deve estar no formato YYYY-MM."
        );

        error.statusCode = 400;

        throw error;
    }

    const summary = dashboardRepository.getSummary(month);

    const totalIncome = Number(summary.total_income);
    const totalExpense = Number(summary.total_expense);

    const balance = totalIncome - totalExpense;

    return {
        month,
        total_income: totalIncome,
        total_expense: totalExpense,
        balance
    };
}

module.exports = {
    getFinancialSummary
};