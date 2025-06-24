// require('dotenv').config() // IMPORTANT: This must be at the top
// const express = require("express")
// const mongoose = require("mongoose")
// const cors = require("cors")
// const multer = require("multer")
// const path = require("path")
// const fs = require("fs")
// const jwt = require("jsonwebtoken")

// const app = express()
// const PORT = process.env.PORT || 3000

// // JWT Secret
// const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this-in-production"

// // HARDCODED OWNER CREDENTIALS
// const OWNER_CREDENTIALS = {
//   username: "getachew",
//   password: "password123",
//   name: "Getachew Beshire",
//   email: "getachew@example.com",
//   role: "owner"
// }

// // Create uploads directory
// const uploadsDir = "uploads"
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir)
// }

// // CORS
// app.use(cors({
//   origin: ["http://localhost:5173", "http://localhost:3000"],
//   credentials: true,
// }))

// app.use(express.json())
// app.use("/uploads", express.static("uploads"))

// // FIXED: MongoDB Atlas connection
// const MONGODB_URI = process.env.MONGODB_URI

// if (!MONGODB_URI) {
//   console.error("❌ MONGODB_URI environment variable is not set!")
//   console.log("💡 Please add MONGODB_URI to your .env file")
//   process.exit(1)
// }

// console.log("🔗 Connecting to MongoDB Atlas...")
// console.log("📍 URI:", MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')) // Hide password in logs

// // Connect to MongoDB Atlas (removed deprecated options)
// mongoose.connect(MONGODB_URI)

// const db = mongoose.connection

// db.on('error', (error) => {
//   console.error("❌ MongoDB connection error:", error.message)
//   if (error.message.includes('ECONNREFUSED')) {
//     console.log("💡 This looks like a local connection error.")
//     console.log("💡 Make sure you're using MongoDB Atlas connection string in .env file")
//   }
//   if (error.message.includes('authentication failed')) {
//     console.log("💡 Check your username and password in the connection string")
//   }
//   if (error.message.includes('bad auth')) {
//     console.log("💡 Authentication failed. Check your database user credentials")
//   }
// })

// db.once('open', () => {
//   console.log("✅ Connected to MongoDB Atlas")
//   console.log(`📊 Database: ${db.name}`)
//   console.log(`🌍 Host: ${db.host}`)
// })

// // MongoDB Schema
// const blogSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   content: {
//     type: String,
//     required: true
//   },
//   author: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   date: {
//     type: Date,
//     required: true,
//     default: Date.now
//   },
//   link: {
//     type: String,
//     trim: true,
//     default: null
//   },
//   image: {
//     type: String,
//     default: null
//   }
// }, {
//   timestamps: true // Automatically adds createdAt and updatedAt
// })

// const Blog = mongoose.model('Blog', blogSchema)

// // JWT Middleware
// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization']
//   const token = authHeader && authHeader.split(' ')[1]

//   if (!token) {
//     return res.status(401).json({ error: 'Access token required' })
//   }

//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) {
//       return res.status(403).json({ error: 'Invalid or expired token' })
//     }
//     req.user = user
//     next()
//   })
// }

// // Multer setup
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
//     cb(null, uniqueSuffix + path.extname(file.originalname))
//   },
// })

// const upload = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith("image/")) {
//       cb(null, true)
//     } else {
//       cb(new Error("Only image files are allowed!"), false)
//     }
//   },
//   limits: { fileSize: 5 * 1024 * 1024 },
// })

// // Routes
// app.get("/", (req, res) => {
//   const dbState = mongoose.connection.readyState
//   const states = { 0: 'Disconnected', 1: 'Connected', 2: 'Connecting', 3: 'Disconnecting' }
  
//   res.json({
//     message: "Getachew Blog API with MongoDB Atlas",
//     status: "✅ Online",
//     database: states[dbState] || 'Unknown',
//     timestamp: new Date().toISOString()
//   })
// })

// // Health check
// app.get("/health", async (req, res) => {
//   try {
//     const dbState = mongoose.connection.readyState
//     const states = { 0: 'Disconnected', 1: 'Connected', 2: 'Connecting', 3: 'Disconnecting' }
    
//     if (dbState === 1) {
//       const blogCount = await Blog.countDocuments()
//       res.json({ 
//         status: "✅ Healthy", 
//         database: `MongoDB Atlas (${states[dbState]})`,
//         blogCount: blogCount,
//         host: mongoose.connection.host,
//         timestamp: new Date().toISOString()
//       })
//     } else {
//       res.status(500).json({ 
//         status: "❌ Unhealthy", 
//         database: `MongoDB Atlas (${states[dbState]})`,
//         timestamp: new Date().toISOString()
//       })
//     }
//   } catch (error) {
//     res.status(500).json({ 
//       status: "❌ Unhealthy", 
//       error: error.message,
//       timestamp: new Date().toISOString()
//     })
//   }
// })

// // Auth routes
// app.post("/api/auth/login", (req, res) => {
//   try {
//     const { username, password } = req.body

//     if (!username || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Username and password are required"
//       })
//     }

//     if (username === OWNER_CREDENTIALS.username && password === OWNER_CREDENTIALS.password) {
//       const token = jwt.sign(
//         { username: OWNER_CREDENTIALS.username, role: OWNER_CREDENTIALS.role },
//         JWT_SECRET,
//         { expiresIn: '24h' }
//       )

//       res.json({
//         success: true,
//         message: "Login successful",
//         token: token,
//         user: {
//           name: OWNER_CREDENTIALS.name,
//           email: OWNER_CREDENTIALS.email,
//           username: OWNER_CREDENTIALS.username,
//           role: OWNER_CREDENTIALS.role,
//           permissions: ['all']
//         }
//       })
//     } else {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid username or password"
//       })
//     }
//   } catch (error) {
//     console.error("Login error:", error)
//     res.status(500).json({ success: false, message: "Internal server error" })
//   }
// })

// app.get("/api/auth/verify", authenticateToken, (req, res) => {
//   res.json({
//     success: true,
//     user: {
//       name: OWNER_CREDENTIALS.name,
//       email: OWNER_CREDENTIALS.email,
//       username: OWNER_CREDENTIALS.username,
//       role: OWNER_CREDENTIALS.role,
//       permissions: ['all']
//     }
//   })
// })

// app.post("/api/auth/logout", authenticateToken, (req, res) => {
//   res.json({ success: true, message: "Logged out successfully" })
// })

// // Blog routes
// app.get("/blog", async (req, res) => {
//   try {
//     const blogs = await Blog.find().sort({ date: -1 }).lean()

//     const blogsWithImageUrls = blogs.map((blog) => ({
//       ...blog,
//       id: blog._id,
//       imageUrl: blog.image ? `http://localhost:${PORT}/uploads/${blog.image}` : null,
//     }))

//     res.json(blogsWithImageUrls)
//   } catch (error) {
//     console.error("Query error:", error)
//     res.status(500).json({ error: "Failed to fetch blogs" })
//   }
// })

// app.get("/blog/:id", async (req, res) => {
//   try {
//     const { id } = req.params
    
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ error: "Invalid blog ID" })
//     }

//     const blog = await Blog.findById(id).lean()

//     if (!blog) {
//       return res.status(404).json({ error: "Blog not found" })
//     }

//     res.json({
//       ...blog,
//       id: blog._id,
//       imageUrl: blog.image ? `http://localhost:${PORT}/uploads/${blog.image}` : null,
//     })
//   } catch (error) {
//     console.error("Query error:", error)
//     res.status(500).json({ error: "Failed to fetch blog" })
//   }
// })

// app.post("/api/blogupload", authenticateToken, upload.single("image"), async (req, res) => {
//   try {
//     const { title, content, author, date, link } = req.body
//     const image = req.file ? req.file.filename : null

//     if (!title || !content || !author) {
//       return res.status(400).json({
//         error: "Title, content, and author are required fields",
//       })
//     }

//     const newBlog = new Blog({
//       title,
//       content,
//       author,
//       date: date ? new Date(date) : new Date(),
//       link: link || null,
//       image
//     })

//     const savedBlog = await newBlog.save()

//     res.json({
//       message: "Blog uploaded successfully!",
//       id: savedBlog._id,
//       link: savedBlog.link,
//       imageUrl: savedBlog.image ? `http://localhost:${PORT}/uploads/${savedBlog.image}` : null,
//     })
//   } catch (error) {
//     console.error("Insert error:", error)
//     res.status(500).json({ error: "Failed to upload blog" })
//   }
// })

// // Error handling
// app.use((error, req, res, next) => {
//   if (error instanceof multer.MulterError) {
//     if (error.code === "LIMIT_FILE_SIZE") {
//       return res.status(400).json({ error: "File too large. Maximum size is 5MB." })
//     }
//   }
//   if (error.message === "Only image files are allowed!") {
//     return res.status(400).json({ error: "Only image files are allowed!" })
//   }
//   console.error("Unhandled error:", error)
//   res.status(500).json({ error: "Something went wrong!" })
// })

// // Graceful shutdown
// process.on('SIGINT', async () => {
//   console.log('Shutting down gracefully...')
//   await mongoose.connection.close()
//   process.exit(0)
// })

// // Start server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`)
//   console.log(`📁 Static files at http://localhost:${PORT}/uploads/`)
//   console.log(`👤 Owner login: username="${OWNER_CREDENTIALS.username}", password="${OWNER_CREDENTIALS.password}"`)
//   console.log(`💾 Database: MongoDB Atlas`)
//   console.log(`🌐 Health check: http://localhost:${PORT}/health`)
// })




require("dotenv").config()
const express = require("express")
const cors = require("cors")
const fs = require("fs")
const path = require("path")
const mongoose = require("mongoose")

const connectDB = require("./config/db")
const authRoutes = require("./routes/authRoutes")
const blogRoutes = require("./routes/blogRoutes")

const app = express()

// Create uploads directory
const uploadsDir = "uploads"
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir)
  console.log("📁 Created uploads directory")
}

// CORS
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  }),
)

app.use(express.json())
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Connect to database
connectDB()

// Routes
app.get("/", (req, res) => {
  const dbState = mongoose.connection.readyState
  const states = { 0: "Disconnected", 1: "Connected", 2: "Connecting", 3: "Disconnecting" }

  res.json({
    message: "Getachew Blog API with MongoDB Atlas",
    status: "✅ Online",
    database: states[dbState] || "Unknown",
    timestamp: new Date().toISOString(),
  })
})

// API Routes
app.use("/api/auth", authRoutes)
app.use("/blog", blogRoutes)
app.use("/api/blog", blogRoutes)

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
  })
})

// Global error handling
app.use((error, req, res, next) => {
  console.error("❌ Unhandled error:", error)
  res.status(500).json({
    error: "Something went wrong!",
    message: error.message,
  })
})

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down gracefully...")
  try {
    await mongoose.connection.close()
    console.log("✅ Database connection closed")
  } catch (error) {
    console.error("❌ Error closing database:", error)
  }
  process.exit(0)
})

module.exports = app
