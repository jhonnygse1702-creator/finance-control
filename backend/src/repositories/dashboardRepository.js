const db = require("../database/connection");

function getSummary(month) {
    return db
        .prepare(`
            SELECT
                COALESCE(
                    SUM(
                        CASE
                            WHEN type = 'income' THEN amount
                            ELSE 0
                        END
                    ),
                    0
                ) AS total_income,

                COALESCE(
                    SUM(
                        CASE
                            WHEN type = 'expense' THEN amount
                            ELSE 0
                        END
                    ),
                    0
                ) AS total_expense

            FROM transactions

            WHERE transaction_date >= ?
              AND transaction_date < date(?, '+1 month')
        `)
        .get(
            `${month}-01`,
            `${month}-01`
        );
}

module.exports = {
    getSummary
};