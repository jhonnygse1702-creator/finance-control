const fs = require("fs");
const path = require("path");

const db = require("./connection");

const schemaPath = path.join(
    __dirname,
    "../../../database/schema.sql"
);

const seedPath = path.join(
    __dirname,
    "../../../database/seed.sql"
);

const schema = fs.readFileSync(schemaPath, "utf8");
const seed = fs.readFileSync(seedPath, "utf8");

db.exec(schema);
db.exec(seed);

console.log("Banco de dados inicializado com sucesso.");