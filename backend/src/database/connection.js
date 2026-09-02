const Database = require("better-sqlite3");
const path = require("path");

const databasePath = path.join(
    __dirname,
    "../../../database/financecontrol.db"
);

console.log("Banco utilizado:", databasePath);

const db = new Database(databasePath);

db.pragma("foreign_keys = ON");

module.exports = db;