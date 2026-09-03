const db = require("../database/connection");

function getSummary(userId, month) {
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

            WHERE user_id = ?
              AND transaction_date >= ?
              AND transaction_date < date(?, '+1 month')
        `)
        .get(
            userId,
            `${month}-01`,
            `${month}-01`
        );
}

module.exports = {
    getSummary
};