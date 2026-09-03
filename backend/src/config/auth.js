require("dotenv").config();

const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN;

if (!jwtSecret) {
    throw new Error(
        "JWT_SECRET não foi configurado no arquivo .env."
    );
}

if (!jwtExpiresIn) {
    throw new Error(
        "JWT_EXPIRES_IN não foi configurado no arquivo .env."
    );
}

module.exports = {
    jwtSecret,
    jwtExpiresIn
};