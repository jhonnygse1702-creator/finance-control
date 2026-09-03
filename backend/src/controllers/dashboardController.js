const dashboardService = require("../services/dashboardService");

function getFinancialSummary(req, res) {
    const { month } = req.query;

    const summary = dashboardService.getFinancialSummary(month);

    res.json(summary);
}

module.exports = {
    getFinancialSummary
};