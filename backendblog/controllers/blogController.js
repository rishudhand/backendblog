const Blog = require('../models/Blog');


const createBlog = async (req, res) => {
  const { title, content } = req.body;

  try {
    const blog = new Blog({
      title,
      content,
      author: req.user._id,
    });

    const createdBlog = await blog.save();
    res.status(201).json(createdBlog);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getBlogs = async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  try {
    const count = await Blog.countDocuments();
    const blogs = await Blog.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ blogs, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


const updateBlog = async (req, res) => {
  const { title, content } = req.body;

  try {
    const blog = await Blog.findById(req.params.id);

    if (blog) {
      if (blog.author.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      blog.title = title;
      blog.content = content;

      const updatedBlog = await blog.save();
      res.json(updatedBlog);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (blog) {
      if (blog.author.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      await blog.deleteOne();
      res.json({ message: 'Blog removed' });
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createBlog, getBlogs, updateBlog, deleteBlog };