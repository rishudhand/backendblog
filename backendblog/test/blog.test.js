const request = require("supertest");
const app = require("../index");
const Blog = require("../models/Blog");
const mongoose = require("mongoose");

let token;
let blogId;

beforeAll(async () => {
  await Blog.deleteMany();

  const res = await request(app).post("/api/auth/login").send({
    username: "testuser",
    password: "password123",
  });

  token = res.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Blog Management Tests", () => {
  test("Create a new blog", async () => {
    const res = await request(app)
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "My First Blog",
        content: "This is a test blog",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    blogId = res.body._id;
  });

  test("Fetch all blogs with pagination", async () => {
    const res = await request(app).get("/api/blogs?page=1&limit=5");

    expect(res.statusCode).toBe(200);
    // expect(res.body.blogs.length).toBeGreaterThanOrEqual(1);
  });

  test("Update a blog", async () => {
    const res = await request(app)
      .put(`/api/blogs/${blogId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Blog Title",
        content: "Updated content",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Updated Blog Title");
  });

  test("Delete a blog", async () => {
    const res = await request(app)
      .delete(`/api/blogs/${blogId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Blog removed");
  });
});
