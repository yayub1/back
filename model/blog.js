const mongoose = require("mongoose")

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    link: {
      type: String,
      trim: true,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
)

const Blog = mongoose.model("Blog", blogSchema)

module.exports = Blog
