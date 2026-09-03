const db = require("../database/connection");

function findAll() {
    return db
        .prepare(`
            SELECT
                id,
                name,
                email,
                created_at
            FROM users
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
                email,
                password,
                created_at
            FROM users
            WHERE id = ?
        `)
        .get(id);
}

function findByEmail(email) {
    return db
        .prepare(`
            SELECT
                id,
                name,
                email,
                password,
                created_at
            FROM users
            WHERE email = ?
        `)
        .get(email);
}

function create(name, email, password) {
    const statement = db.prepare(`
        INSERT INTO users (
            name,
            email,
            password
        )
        VALUES (?, ?, ?)
    `);

    const result = statement.run(
        name,
        email,
        password
    );

    return {
        id: result.lastInsertRowid,
        name,
        email
    };
}

module.exports = {
    findAll,
    findById,
    findByEmail,
    create
};