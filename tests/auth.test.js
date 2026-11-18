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
    expect(response.body).not.toHaveProperty("password");
    const savedUser = await prisma.user.findUnique({ where: { email: user.email } });
    expect(savedUser.password).not.toBe(user.password);
  });

  test("should reject invalid registration and login payloads", async () => {
    const registration = await request(app).post("/auth/register").send({
      name: "A", email: "not-an-email", password: "123",
    });
    const login = await request(app).post("/auth/login").send({
      email: "not-an-email", password: "123",
    });

    expect(registration.statusCode).toBe(400);
    expect(registration.body.message).toBe("Validation failed");
    expect(login.statusCode).toBe(400);
  });

  test("should not allow duplicate email", async () => {
    const user = makeUser();
    await request(app)
      .post("/auth/register")
      .send(user);

    const response = await request(app)
      .post("/auth/register")
      .send(makeUser({ email: user.email, password: "OutraSenha456" }));

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
