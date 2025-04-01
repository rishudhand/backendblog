const request = require("supertest");
const app = require("../index");
const User = require("../models/User");
const mongoose = require("mongoose");

beforeAll(async () => {
    await User.deleteMany();
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("User Authentication Tests", () => {
    let token;

    test("User registration", async () => {
        const res = await request(app).post("/api/auth/register").send({
            username: "testuser",
            password: "password123",
        });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("token");
    });

    test("User login", async () => {
        const res = await request(app).post("/api/auth/login").send({
            username: "testuser",
            password: "password123",
        });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("token");
        token = res.body.token;
    });

    // test("Access protected route without token", async () => {
    //     const res = await request(app).get("/api/blogs");

    //     expect(res.statusCode).toBe(401);
    //     expect(res.body.message).toBe("Unauthorized");
    // });

    test("Access protected route with valid token", async () => {
        const res = await request(app)
            .get("/api/blogs")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
    });
});
