const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/config/prisma");

let token;

beforeEach(async () => {
  await prisma.user.deleteMany();
  await prisma.teacher.deleteMany();

  await request(app)
    .post("/auth/register")
    .send({
      name: "Test User",
      email: "test@email.com",
      password: "123456",
    });

  const loginResponse = await request(app)
    .post("/auth/login")
    .send({
      email: "test@email.com",
      password: "123456",
    });

  token = loginResponse.body.token;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Teacher Endpoints", () => {
  describe("GET /teachers", () => {
    it("should return all teachers", async () => {
      await prisma.teacher.create({
        data: {
          name: "Carlos Silva",
          subject: "Mathematics",
        },
      });

      const response = await request(app)
        .get("/teachers")
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty("id");
      expect(response.body[0]).toHaveProperty("name");
      expect(response.body[0]).toHaveProperty("subject");
    });
  });

  describe("GET /teachers/:id", () => {
    it("should return one teacher", async () => {
      const teacher = await prisma.teacher.create({
        data: {
          name: "Carlos Silva",
          subject: "Mathematics",
        },
      });

      const response = await request(app)
        .get(`/teachers/${teacher.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBe(teacher.id);
      expect(response.body.name).toBe("Carlos Silva");
      expect(response.body.subject).toBe("Mathematics");
    });
  });

  describe("POST /teachers", () => {
    it("should create a teacher", async () => {
      const response = await request(app)
        .post("/teachers")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Carlos Silva",
          subject: "Mathematics",
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.name).toBe("Carlos Silva");
      expect(response.body.subject).toBe("Mathematics");
    });
  });
});