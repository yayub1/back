const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI

    if (!MONGODB_URI) {
      console.error("❌ MONGODB_URI environment variable is not set!")
      console.log("💡 Please add MONGODB_URI to your .env file")
      process.exit(1)
    }

    console.log("🔗 Connecting to MongoDB Atlas...")
    console.log("📍 URI:", MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, "//***:***@"))

    await mongoose.connect(MONGODB_URI)

    const db = mongoose.connection

    db.on("error", (error) => {
      console.error("❌ MongoDB connection error:", error.message)
      if (error.message.includes("ECONNREFUSED")) {
        console.log("💡 This looks like a local connection error.")
        console.log("💡 Make sure you're using MongoDB Atlas connection string in .env file")
      }
      if (error.message.includes("authentication failed")) {
        console.log("💡 Check your username and password in the connection string")
      }
      if (error.message.includes("bad auth")) {
        console.log("💡 Authentication failed. Check your database user credentials")
      }
    })

    db.once("open", () => {
      console.log("✅ Connected to MongoDB Atlas")
      console.log(`📊 Database: ${db.name}`)
      console.log(`🌍 Host: ${db.host}`)
    })
  } catch (error) {
    console.error("❌ Database connection failed:", error.message)
    process.exit(1)
  }
}

module.exports = connectDB
