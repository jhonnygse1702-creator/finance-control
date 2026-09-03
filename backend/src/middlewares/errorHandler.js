function errorHandler(err, req, res, next) {
    console.error(err);

    if (
        err instanceof SyntaxError &&
        err.status === 400 &&
        "body" in err
    ) {
        return res.status(400).json({
            error: "O corpo da requisição contém um JSON inválido."
        });
    }

    const statusCode =
        Number.isInteger(err.statusCode) &&
        err.statusCode >= 400 &&
        err.statusCode < 600
            ? err.statusCode
            : 500;

    return res.status(statusCode).json({
        error:
            err.message ||
            "Ocorreu um erro interno no servidor."
    });
}

module.exports = errorHandler;