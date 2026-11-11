const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/config/prisma");

describe("Authentication", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test("should register a new user", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({
        name: "Guilherme",
        email: "gui@email.com",
        password: "123456",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.email).toBe("gui@email.com");
  });

  test("should not allow duplicate email", async () => {
    await request(app)
      .post("/auth/register")
      .send({
        name: "Guilherme",
        email: "gui@email.com",
        password: "123456",
      });

    const response = await request(app)
      .post("/auth/register")
      .send({
        name: "Outro Usuario",
        email: "gui@email.com",
        password: "654321",
      });

    expect(response.statusCode).toBe(400);
  });

  test("should login successfully", async () => {
    await request(app)
      .post("/auth/register")
      .send({
        name: "Guilherme",
        email: "gui@email.com",
        password: "123456",
      });

    const response = await request(app)
      .post("/auth/login")
      .send({
        email: "gui@email.com",
        password: "123456",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  test("should reject invalid password", async () => {
    await request(app)
      .post("/auth/register")
      .send({
        name: "Guilherme",
        email: "gui@email.com",
        password: "123456",
      });

    const response = await request(app)
      .post("/auth/login")
      .send({
        email: "gui@email.com",
        password: "senhaerrada",
      });

    expect(response.statusCode).toBe(401);
  });

  test("should reject non-existing user", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        email: "naoexiste@email.com",
        password: "123456",
      });

    expect(response.statusCode).toBe(401);
  });

  test("should deny access without token", async () => {
    const response = await request(app)
      .get("/teachers");

    expect(response.statusCode).toBe(401);
  });

  test("should allow access with valid token", async () => {
    await request(app)
      .post("/auth/register")
      .send({
        name: "Guilherme",
        email: "gui@email.com",
        password: "123456",
      });

    const loginResponse = await request(app)
      .post("/auth/login")
      .send({
        email: "gui@email.com",
        password: "123456",
      });

    const token = loginResponse.body.token;

    const response = await request(app)
      .get("/teachers")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });
});