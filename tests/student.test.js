const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/config/prisma");

beforeEach(async () => {
  await prisma.student.deleteMany();
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

      const response = await request(app).get("/students");

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
        .get(`/students/${student.id}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBe(student.id);
      expect(response.body.name).toBe("Maria");
    });
  });

  describe("POST /students", () => {
    it("should create a student", async () => {
      const response = await request(app)
        .post("/students")
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