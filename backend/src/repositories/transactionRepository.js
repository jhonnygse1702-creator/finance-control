const db = require("../database/connection");

function findAll() {
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
            ORDER BY transactions.transaction_date DESC, transactions.id DESC
        `)
        .all();
}

function findById(id) {
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
        `)
        .get(id);
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
    `);

    return statement.run(
        categoryId,
        description,
        amount,
        type,
        transactionDate,
        notes || null,
        id
    );
}

function remove(id) {
    const statement = db.prepare(`
        DELETE FROM transactions
        WHERE id = ?
    `);

    return statement.run(id);
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove
};