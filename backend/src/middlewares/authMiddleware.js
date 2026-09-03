const jwt = require("jsonwebtoken");

const {
    jwtSecret
} = require("../config/auth");

function authMiddleware(req, res, next) {
    const authorization =
        req.headers.authorization;

    if (!authorization) {
        return res.status(401).json({
            error: "Token de autenticação não informado."
        });
    }

    const parts =
        authorization.split(" ");

    if (
        parts.length !== 2 ||
        parts[0] !== "Bearer"
    ) {
        return res.status(401).json({
            error: "Formato do token inválido. Use Bearer <token>."
        });
    }

    const token = parts[1];

    try {
        const decoded =
            jwt.verify(
                token,
                jwtSecret
            );

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            error: "Token inválido ou expirado."
        });
    }
}

module.exports = authMiddleware;