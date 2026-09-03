const express = require("express");

const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post(
    "/register",
    authController.register
);

router.post(
    "/login",
    authController.login
);

router.get(
    "/me",
    authMiddleware,
    (req, res) => {
        res.json({
            message: "Usuário autenticado com sucesso.",
            user: req.user
        });
    }
);

module.exports = router;