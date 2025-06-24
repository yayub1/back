const express = require("express")
const { authenticateToken } = require("../middleware/auth")
const { login, verifyToken, logout } = require("../controller/authController")

const router = express.Router()

router.post("/login", login)
router.get("/verify", authenticateToken, verifyToken)
router.post("/logout", authenticateToken, logout)

module.exports = router
