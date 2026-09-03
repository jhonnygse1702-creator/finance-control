const dashboardService = require("../services/dashboardService");

function getFinancialSummary(req, res) {
    const summary = dashboardService.getFinancialSummary();

    res.json(summary);
}

module.exports = {
    getFinancialSummary
};