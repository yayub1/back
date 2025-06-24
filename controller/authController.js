const jwt = require("jsonwebtoken")
const { JWT_SECRET } = require("../middleware/auth")

// HARDCODED OWNER CREDENTIALS
const OWNER_CREDENTIALS = {
  username: "getachew",
  password: "password123",
  name: "Getachew Beshire",
  email: "getachew@example.com",
  role: "owner",
}

const login = (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      })
    }

    if (username === OWNER_CREDENTIALS.username && password === OWNER_CREDENTIALS.password) {
      const token = jwt.sign({ username: OWNER_CREDENTIALS.username, role: OWNER_CREDENTIALS.role }, JWT_SECRET, {
        expiresIn: "24h",
      })

      res.json({
        success: true,
        message: "Login successful",
        token: token,
        user: {
          name: OWNER_CREDENTIALS.name,
          email: OWNER_CREDENTIALS.email,
          username: OWNER_CREDENTIALS.username,
          role: OWNER_CREDENTIALS.role,
          permissions: ["all"],
        },
      })
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      })
    }
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}

const verifyToken = (req, res) => {
  res.json({
    success: true,
    user: {
      name: OWNER_CREDENTIALS.name,
      email: OWNER_CREDENTIALS.email,
      username: OWNER_CREDENTIALS.username,
      role: OWNER_CREDENTIALS.role,
      permissions: ["all"],
    },
  })
}

const logout = (req, res) => {
  res.json({ success: true, message: "Logged out successfully" })
}

module.exports = {
  login,
  verifyToken,
  logout,
}
