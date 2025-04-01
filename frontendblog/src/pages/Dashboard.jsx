import { useState, useEffect } from "react";
import axios from "axios";


const Dashboard = ({ user }) => {
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [editedContent, setEditedContent] = useState({ title: "", content: "" });
  const [newBlog, setNewBlog] = useState({ title: "", content: "", author: user.username, date: "" });

  useEffect(() => {
    axios.get(`${BASEUR}/blogs`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
      .then(res => setBlogs(res.data.blogs))
      .catch(err => console.log(err));
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASEURL}/blogs/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      setBlogs(blogs.filter(blog => blog._id !== id));
    } catch (error) {
      alert("Error deleting blog");
    }
  };

  const handleEditClick = (blog) => {
    setEditingBlog(blog._id);
    setEditedContent({ title: blog.title, content: blog.content });
  };

  const handleEditSubmit = async (id) => {
    try {
      const response = await axios.put(`${BASEURL}/blogs/${id}`, editedContent, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBlogs(blogs.map(blog => (blog._id === id ? response.data.blog : blog)));
      setEditingBlog(null);
    } catch (error) {
      alert("Error updating blog");
    }
  };

  const handleAddBlog = async () => {
    try {
      const response = await axios.post(`${BASEURL}/blogs`, newBlog, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setBlogs([response.data.blog, ...blogs]); 
      setNewBlog({ title: "", content: "", author: user.username, date: "" });
    } catch (error) {
      alert("Error adding blog");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">Your Blogs</h2>

      <div className="border p-4 mb-4">
        <h3 className="text-xl font-semibold">Add New Blog</h3>
        <input
          type="text"
          placeholder="Title"
          value={newBlog.title}
          onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
          className="border p-2 w-full mt-2"
        />
        <textarea
          placeholder="Content"
          value={newBlog.content}
          onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
          className="border p-2 w-full mt-2"
        />
        <input
          type="date"
          value={newBlog.date}
          onChange={(e) => setNewBlog({ ...newBlog, date: e.target.value })}
          className="border p-2 w-full mt-2"
        />
        <button onClick={handleAddBlog} className="bg-green-500 px-4 py-2 text-white mt-2">Add Blog</button>
      </div>

      <ul>
        {blogs.map(blog => (
          <li key={blog._id} className="border p-2 mt-2">
            {editingBlog === blog._id ? (
              <div>
                <input
                  type="text"
                  value={editedContent.title}
                  onChange={(e) => setEditedContent({ ...editedContent, title: e.target.value })}
                  className="border p-1 w-full"
                />
                <textarea
                  value={editedContent.content}
                  onChange={(e) => setEditedContent({ ...editedContent, content: e.target.value })}
                  className="border p-1 w-full mt-2"
                />
                <button onClick={() => handleEditSubmit(blog._id)} className="bg-blue-500 px-2 py-1 text-white ml-2">Save</button>
                <button onClick={() => setEditingBlog(null)} className="bg-gray-500 px-2 py-1 text-white ml-2">Cancel</button>
              </div>
            ) : (
              <div>
                <h3 className="font-bold">{blog.title}</h3>
                <p>{blog.content}</p>
                <small>By {blog.author.username} on {new Date(blog.date).toDateString()}</small>
                {user._id === blog.author._id && (
                  <>
                    <button onClick={() => handleDelete(blog._id)} className="bg-red-500 px-2 py-1 text-white ml-2">Delete</button>
                    <button onClick={() => handleEditClick(blog)} className="bg-blue-500 px-2 py-1 text-white ml-2">Edit</button>
                  </>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
