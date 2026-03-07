const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");

describe("Auth API", () => {
  /* ================= REGISTER TEST ================= */

  test("Register User", async () => {
    const response = await request(app).post("/api/v1/auth/register").send({
      username: "testuser",
      first_name: "Test",
      last_name: "User",
      email: "test@gmail.com",
      phone_no: "9999999999",
      password: "Test@123",
      role: "user",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
  }, 20000);

  /* ================= LOGIN TEST ================= */

  test("Login User", async () => {
    const response = await request(app).post("/api/v1/auth/login").send({
      username: "testuser",
      password: "Test@123",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  }, 20000);
});

/* ================= CLOSE DB CONNECTION ================= */

afterAll(async () => {
  await mongoose.connection.close();
});
