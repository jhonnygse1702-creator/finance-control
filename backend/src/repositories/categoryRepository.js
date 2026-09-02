const db = require("../database/connection");

function findAll() {
    return db
        .prepare(`
            SELECT
                id,
                name,
                type,
                created_at
            FROM categories
            ORDER BY name ASC
        `)
        .all();
}

function findById(id) {
    return db
        .prepare(`
            SELECT
                id,
                name,
                type,
                created_at
            FROM categories
            WHERE id = ?
        `)
        .get(id);
}

function update(id, name, type) {
    const statement = db.prepare(`
        UPDATE categories
        SET name = ?, type = ?
        WHERE id = ?
    `);

    const result = statement.run(name, type, id);

    return result;
}

function create(name, type) {
    const statement = db.prepare(`
        INSERT INTO categories (name, type)
        VALUES (?, ?)
    `);

    const result = statement.run(name, type);

    return {
        id: result.lastInsertRowid,
        name,
        type
    };
}

function remove(id) {
    const statement = db.prepare(`
        DELETE FROM categories
        WHERE id = ?
    `);

    const result = statement.run(id);

    return result;
}

module.exports = {
    findAll,
    findById,
    update,
    create,
    remove
};