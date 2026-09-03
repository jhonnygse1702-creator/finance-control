const userService = require("../services/userService");

async function register(req, res) {
    const {
        name,
        email,
        password
    } = req.body;

    const user = await userService.createUser(
        name,
        email,
        password
    );

    res.status(201).json(user);
}

async function login(req, res) {
    const {
        email,
        password
    } = req.body;

    const user = await userService.authenticateUser(
        email,
        password
    );

    res.json(user);
}

module.exports = {
    register,
    login
};