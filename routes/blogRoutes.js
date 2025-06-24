const express = require("express")
const { authenticateToken } = require("../middleware/auth")
const { upload, handleUploadError } = require("../middleware/upload")
const { getAllBlogs, getBlogById, createBlog, getHealthCheck } = require("../controller/blogController")

const router = express.Router()

// Public routes
router.get("/", getAllBlogs)
router.get("/health", getHealthCheck)
router.get("/:id", getBlogById)

// Protected routes
router.post("/upload", authenticateToken, upload.single("image"), createBlog)

// Error handling middleware should be at the end
router.use(handleUploadError)

module.exports = router
