const db = require("../database/connection");

function findAll(userId) {
    return db
        .prepare(`
            SELECT
                transactions.id,
                transactions.user_id,
                transactions.category_id,
                transactions.description,
                transactions.amount,
                transactions.type,
                transactions.transaction_date,
                transactions.notes,
                transactions.created_at,
                transactions.updated_at,
                categories.name AS category_name
            FROM transactions
            INNER JOIN categories
                ON categories.id = transactions.category_id
            WHERE transactions.user_id = ?
            ORDER BY transactions.transaction_date DESC, transactions.id DESC
        `)
        .all(userId);
}

function findById(id, userId) {
    return db
        .prepare(`
            SELECT
                transactions.id,
                transactions.user_id,
                transactions.category_id,
                transactions.description,
                transactions.amount,
                transactions.type,
                transactions.transaction_date,
                transactions.notes,
                transactions.created_at,
                transactions.updated_at,
                categories.name AS category_name
            FROM transactions
            INNER JOIN categories
                ON categories.id = transactions.category_id
            WHERE transactions.id = ?
              AND transactions.user_id = ?
        `)
        .get(id, userId);
}

function create(
    userId,
    categoryId,
    description,
    amount,
    type,
    transactionDate,
    notes
) {
    const statement = db.prepare(`
        INSERT INTO transactions (
            user_id,
            category_id,
            description,
            amount,
            type,
            transaction_date,
            notes
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = statement.run(
        userId,
        categoryId,
        description,
        amount,
        type,
        transactionDate,
        notes || null
    );

    return {
        id: result.lastInsertRowid
    };
}

function update(
    id,
    userId,
    categoryId,
    description,
    amount,
    type,
    transactionDate,
    notes
) {
    const statement = db.prepare(`
        UPDATE transactions
        SET
            category_id = ?,
            description = ?,
            amount = ?,
            type = ?,
            transaction_date = ?,
            notes = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
          AND user_id = ?
    `);

    return statement.run(
        categoryId,
        description,
        amount,
        type,
        transactionDate,
        notes || null,
        id,
        userId
    );
}

function remove(id, userId) {
    const statement = db.prepare(`
        DELETE FROM transactions
        WHERE id = ?
          AND user_id = ?
    `);

    return statement.run(
        id,
        userId
    );
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove
};