const express = require('express');
const {
  createBlog,
  getBlogs,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController');
const {isValid  } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', isValid, createBlog);

router.get('/', getBlogs);

router.put('/:id', isValid, updateBlog);

router.delete('/:id', isValid, deleteBlog);

module.exports = router;