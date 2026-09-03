const dashboardService = require("../services/dashboardService");

function getFinancialSummary(req, res) {
    const { month } = req.query;

    const userId = req.user.id;

    const summary =
        dashboardService.getFinancialSummary(
            userId,
            month
        );

    res.json(summary);
}

module.exports = {
    getFinancialSummary
};