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

module.exports = {
    findAll
};