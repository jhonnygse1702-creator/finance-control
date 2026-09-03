const bcrypt = require("bcrypt");

const userRepository = require("../repositories/userRepository");
const { generateToken } = require("../utils/jwt");

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function createUser(name, email, password) {
    if (
        !name ||
        typeof name !== "string" ||
        name.trim() === ""
    ) {
        const error = new Error(
            "O nome é obrigatório."
        );

        error.statusCode = 400;

        throw error;
    }

    if (
        !email ||
        typeof email !== "string" ||
        email.trim() === ""
    ) {
        const error = new Error(
            "O e-mail é obrigatório."
        );

        error.statusCode = 400;

        throw error;
    }

    const normalizedEmail =
        email.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
        const error = new Error(
            "O e-mail informado possui um formato inválido."
        );

        error.statusCode = 400;

        throw error;
    }

    if (
        !password ||
        typeof password !== "string" ||
        password.length < 6
    ) {
        const error = new Error(
            "A senha deve possuir pelo menos 6 caracteres."
        );

        error.statusCode = 400;

        throw error;
    }

    const existingUser =
        userRepository.findByEmail(
            normalizedEmail
        );

    if (existingUser) {
        const error = new Error(
            "Já existe um usuário cadastrado com este e-mail."
        );

        error.statusCode = 409;

        throw error;
    }

    const hashedPassword =
        await bcrypt.hash(
            password,
            10
        );

    return userRepository.create(
        name.trim(),
        normalizedEmail,
        hashedPassword
    );
}

async function authenticateUser(
    email,
    password
) {
    if (
        !email ||
        typeof email !== "string"
    ) {
        const error = new Error(
            "O e-mail é obrigatório."
        );

        error.statusCode = 400;

        throw error;
    }

    if (
        !password ||
        typeof password !== "string"
    ) {
        const error = new Error(
            "A senha é obrigatória."
        );

        error.statusCode = 400;

        throw error;
    }

    const normalizedEmail =
        email.trim().toLowerCase();

    const user =
        userRepository.findByEmail(
            normalizedEmail
        );

    if (!user) {
        const error = new Error(
            "E-mail ou senha inválidos."
        );

        error.statusCode = 401;

        throw error;
    }

    const passwordMatches =
        await bcrypt.compare(
            password,
            user.password
        );

    if (!passwordMatches) {
        const error = new Error(
            "E-mail ou senha inválidos."
        );

        error.statusCode = 401;

        throw error;
    }

    const authenticatedUser = {
        id: user.id,
        name: user.name,
        email: user.email
    };

    const token =
        generateToken(authenticatedUser);

    return {
        user: authenticatedUser,
        token
    };
}

function getUserById(id) {
    const user =
        userRepository.findById(id);

    if (!user) {
        const error = new Error(
            "Usuário não encontrado."
        );

        error.statusCode = 404;

        throw error;
    }

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at
    };
}

module.exports = {
    createUser,
    authenticateUser,
    getUserById
};