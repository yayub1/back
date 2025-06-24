const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Only image files are allowed!"), false)
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
})

// Error handling middleware for multer
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File too large. Maximum size is 5MB." })
    }
  }
  if (error.message === "Only image files are allowed!") {
    return res.status(400).json({ error: "Only image files are allowed!" })
  }
  next(error)
}

module.exports = { upload, handleUploadError }
