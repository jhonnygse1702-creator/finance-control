const db = require("../database/connection");

function getSummary() {
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
        `)
        .get();
}

module.exports = {
    getSummary
};