const mongoose = require("mongoose")
const Blog = require("../model/blog")

const PORT = process.env.PORT || 3000

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ date: -1 }).lean()

    const blogsWithImageUrls = blogs.map((blog) => ({
      ...blog,
      id: blog._id,
      imageUrl: blog.image ? `http://localhost:${PORT}/uploads/${blog.image}` : null,
    }))

    res.json(blogsWithImageUrls)
  } catch (error) {
    console.error("Query error:", error)
    res.status(500).json({ error: "Failed to fetch blogs" })
  }
}

const getBlogById = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid blog ID" })
    }

    const blog = await Blog.findById(id).lean()

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" })
    }

    res.json({
      ...blog,
      id: blog._id,
      imageUrl: blog.image ? `http://localhost:${PORT}/uploads/${blog.image}` : null,
    })
  } catch (error) {
    console.error("Query error:", error)
    res.status(500).json({ error: "Failed to fetch blog" })
  }
}

const createBlog = async (req, res) => {
  try {
    const { title, content, author, date, link } = req.body
    const image = req.file ? req.file.filename : null

    if (!title || !content || !author) {
      return res.status(400).json({
        error: "Title, content, and author are required fields",
      })
    }

    const newBlog = new Blog({
      title,
      content,
      author,
      date: date ? new Date(date) : new Date(),
      link: link || null,
      image,
    })

    const savedBlog = await newBlog.save()

    res.json({
      message: "Blog uploaded successfully!",
      id: savedBlog._id,
      link: savedBlog.link,
      imageUrl: savedBlog.image ? `http://localhost:${PORT}/uploads/${savedBlog.image}` : null,
    })
  } catch (error) {
    console.error("Insert error:", error)
    res.status(500).json({ error: "Failed to upload blog" })
  }
}

const getHealthCheck = async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState
    const states = { 0: "Disconnected", 1: "Connected", 2: "Connecting", 3: "Disconnecting" }

    if (dbState === 1) {
      const blogCount = await Blog.countDocuments()
      res.json({
        status: "✅ Healthy",
        database: `MongoDB Atlas (${states[dbState]})`,
        blogCount: blogCount,
        host: mongoose.connection.host,
        timestamp: new Date().toISOString(),
      })
    } else {
      res.status(500).json({
        status: "❌ Unhealthy",
        database: `MongoDB Atlas (${states[dbState]})`,
        timestamp: new Date().toISOString(),
      })
    }
  } catch (error) {
    res.status(500).json({
      status: "❌ Unhealthy",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
}

module.exports = {
  getAllBlogs,
  getBlogById,
  createBlog,
  getHealthCheck,
}
