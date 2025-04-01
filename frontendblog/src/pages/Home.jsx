import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    axios.get(`${BASEURL}/blogs?page=${page}`)
      .then(res => {
        setBlogs(res.data.blogs);
        setTotalPages(res.data.totalPages);
      })
      .catch(err => console.log(err));
  }, [page]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Latest Blogs</h2>
      {blogs.map(blog => (
        <div key={blog._id} className="border p-4 mb-4">
          <h3 className="text-xl font-bold">{blog.title}</h3>
          <p>{blog.content.substring(0, 100)}...</p>
          <small>By {blog.author.username}</small>
        </div>
      ))}
      <div className="flex justify-between mt-4">
        <button disabled={page === 1} onClick={() => setPage(page - 1)} className="bg-gray-500 text-white px-3 py-1 rounded">Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="bg-gray-500 text-white px-3 py-1 rounded">Next</button>
      </div>
    </div>
  );
};

export default Home;