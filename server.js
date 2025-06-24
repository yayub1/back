const app = require("./app")

const PORT = process.env.PORT || 3000

// HARDCODED OWNER CREDENTIALS for logging
const OWNER_CREDENTIALS = {
  username: "getachew",
  password: "password123",
}

// Start server
const server = app.listen(PORT, () => {
  console.log("🚀 ================================")
  console.log(`🚀 Server running at http://localhost:${PORT}`)
  console.log(`📁 Static files at http://localhost:${PORT}/uploads/`)
  console.log(`👤 Owner login: username="${OWNER_CREDENTIALS.username}", password="${OWNER_CREDENTIALS.password}"`)
  console.log(`💾 Database: MongoDB Atlas`)
  console.log(`🌐 Health check: http://localhost:${PORT}/blog/health`)
  console.log("🚀 ================================")
  console.log("📋 Available endpoints:")
  console.log("   GET  /                     - API status")
  console.log("   POST /api/auth/login       - Login")
  console.log("   GET  /api/auth/verify      - Verify token")
  console.log("   POST /api/auth/logout      - Logout")
  console.log("   GET  /blog                 - Get all blogs")
  console.log("   GET  /blog/:id             - Get blog by ID")
  console.log("   POST /blog/upload          - Create blog (auth required)")
  console.log("   GET  /blog/health          - Health check")
  console.log("🚀 ================================")
})

// Handle server errors
server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use`)
    console.log("💡 Try using a different port or stop the other process")
  } else {
    console.error("❌ Server error:", error)
  }
})
