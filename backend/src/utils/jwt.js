const jwt = require("jsonwebtoken");

const {
    jwtSecret,
    jwtExpiresIn
} = require("../config/auth");

function generateToken(user) {
    return jwt.sign(
        {
            id: user.id,
            name: user.name,
            email: user.email
        },
        jwtSecret,
        {
            expiresIn: jwtExpiresIn
        }
    );
}

module.exports = {
    generateToken
};