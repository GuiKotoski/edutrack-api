const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/config/prisma");
const { makeUser } = require("./factories/userFactory");

describe("Authentication", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test("should register a new user", async () => {
    const user = makeUser();
    const response = await request(app)
      .post("/auth/register")
      .send(user);

    expect(response.statusCode).toBe(201);
    expect(response.body.email).toBe(user.email);
  });

  test("should not allow duplicate email", async () => {
    const user = makeUser();
    await request(app)
      .post("/auth/register")
      .send(user);

    const response = await request(app)
      .post("/auth/register")
      .send(makeUser({ email: user.email, password: "654321" }));

    expect(response.statusCode).toBe(400);
  });

  test("should login successfully", async () => {
    const user = makeUser();
    await request(app)
      .post("/auth/register")
      .send(user);

    const response = await request(app)
      .post("/auth/login")
      .send({ email: user.email, password: user.password });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  test("should reject invalid password", async () => {
    const user = makeUser();
    await request(app)
      .post("/auth/register")
      .send(user);

    const response = await request(app)
      .post("/auth/login")
      .send({ email: user.email, password: "senhaerrada" });

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
    const user = makeUser();
    await request(app)
      .post("/auth/register")
      .send(user);

    const loginResponse = await request(app)
      .post("/auth/login")
      .send({ email: user.email, password: user.password });

    const token = loginResponse.body.token;

    const response = await request(app)
      .get("/teachers")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });
});
