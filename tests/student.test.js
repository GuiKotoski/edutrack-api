const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/config/prisma");

let token;

beforeEach(async () => {
  await prisma.user.deleteMany();
  await prisma.student.deleteMany();

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

describe("Student Endpoints", () => {
  describe("GET /students", () => {
    it("should return all students", async () => {
      await prisma.student.create({
        data: {
          name: "João Santos",
          age: 15,
        },
      });

      const response = await request(app)
        .get("/students")
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty("id");
      expect(response.body[0]).toHaveProperty("name");
      expect(response.body[0]).toHaveProperty("age");
    });
  });

  describe("GET /students/:id", () => {
    it("should return one student", async () => {
      const student = await prisma.student.create({
        data: {
          name: "Maria",
          age: 16,
        },
      });

      const response = await request(app)
        .get(`/students/${student.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBe(student.id);
      expect(response.body.name).toBe("Maria");
    });
  });

  describe("POST /students", () => {
    it("should create a student", async () => {
      const response = await request(app)
        .post("/students")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Pedro",
          age: 17,
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.name).toBe("Pedro");
      expect(response.body.age).toBe(17);
    });
  });
});