const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/config/prisma");
const { makeUser } = require("./factories/userFactory");
const { makeTeacher } = require("./factories/teacherFactory");

let token;
let ownerId;

beforeEach(async () => {
  await prisma.student.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.user.deleteMany();

  const user = makeUser();
  await request(app)
    .post("/auth/register")
    .send(user);
  ownerId = (await prisma.user.findUnique({ where: { email: user.email } })).id;

  const loginResponse = await request(app)
    .post("/auth/login")
    .send({ email: user.email, password: user.password });

  token = loginResponse.body.token;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Teacher Endpoints", () => {
  it("isolates teacher records between accounts", async () => {
    const other = makeUser();
    await request(app).post("/auth/register").send(other);
    const otherId = (await prisma.user.findUnique({ where: { email: other.email } })).id;
    const otherTeacher = await prisma.teacher.create({
      data: { ...makeTeacher(), ownerId: otherId },
    });

    const list = await request(app).get("/teachers").set("Authorization", `Bearer ${token}`);
    const get = await request(app).get(`/teachers/${otherTeacher.id}`).set("Authorization", `Bearer ${token}`);
    const update = await request(app).put(`/teachers/${otherTeacher.id}`)
      .set("Authorization", `Bearer ${token}`).send({ subject: "Changed" });
    const remove = await request(app).delete(`/teachers/${otherTeacher.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(list.body).toEqual([]);
    expect(get.statusCode).toBe(404);
    expect(update.statusCode).toBe(404);
    expect(remove.statusCode).toBe(404);
    expect(await prisma.teacher.findUnique({ where: { id: otherTeacher.id } })).not.toBeNull();
  });

  describe("GET /teachers", () => {
    it("should return all teachers", async () => {
      await prisma.teacher.create({
        data: { ...makeTeacher(), ownerId },
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

    it("should reject requests without a token", async () => {
      const response = await request(app).get("/teachers");
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe("Token required");
    });

    it("should reject an invalid token", async () => {
      const response = await request(app)
        .get("/teachers")
        .set("Authorization", "Bearer invalid-token");
      expect(response.statusCode).toBe(403);
      expect(response.body.message).toBe("Invalid token");
    });
  });

  describe("GET /teachers/:id", () => {
    it("should return one teacher", async () => {
      const teacher = await prisma.teacher.create({
        data: { ...makeTeacher({ name: "Carlos Silva", subject: "Mathematics" }), ownerId },
      });

      const response = await request(app)
        .get(`/teachers/${teacher.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBe(teacher.id);
      expect(response.body.name).toBe("Carlos Silva");
      expect(response.body.subject).toBe("Mathematics");
    });

    it("should return 404 for an unknown teacher", async () => {
      const response = await request(app)
        .get("/teachers/999999")
        .set("Authorization", `Bearer ${token}`);
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe("Teacher not found");
    });
  });

  describe("POST /teachers", () => {
    it("should create a teacher", async () => {
      const response = await request(app)
        .post("/teachers")
        .set("Authorization", `Bearer ${token}`)
        .send(makeTeacher({ name: "Carlos Silva", subject: "Mathematics" }));

      expect(response.statusCode).toBe(201);
      expect(response.body.name).toBe("Carlos Silva");
      expect(response.body.subject).toBe("Mathematics");
    });
  });

  describe("PUT and DELETE /teachers/:id", () => {
    it("should update a teacher", async () => {
      const teacher = await prisma.teacher.create({ data: { ...makeTeacher(), ownerId } });
      const response = await request(app)
        .put(`/teachers/${teacher.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ subject: "Biology" });

      expect(response.statusCode).toBe(200);
      expect(response.body.subject).toBe("Biology");
    });

    it("should return 404 when updating or deleting a missing teacher", async () => {
      const update = await request(app)
        .put("/teachers/999999")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Valid Name" });
      const remove = await request(app)
        .delete("/teachers/999999")
        .set("Authorization", `Bearer ${token}`);

      expect(update.statusCode).toBe(404);
      expect(update.body.message).toBe("Resource not found");
      expect(remove.statusCode).toBe(404);
    });

    it("should delete a teacher", async () => {
      const teacher = await prisma.teacher.create({ data: { ...makeTeacher(), ownerId } });
      const response = await request(app)
        .delete(`/teachers/${teacher.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(204);
      expect(await prisma.teacher.findUnique({ where: { id: teacher.id } })).toBeNull();
    });
  });

  describe("teacher and student relationship", () => {
    it("should list and create students for a teacher", async () => {
      const teacher = await prisma.teacher.create({ data: { ...makeTeacher(), ownerId } });
      const created = await request(app)
        .post(`/teachers/${teacher.id}/students`)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Ana Silva", age: 15 });
      const list = await request(app)
        .get(`/teachers/${teacher.id}/students`)
        .set("Authorization", `Bearer ${token}`);

      expect(created.statusCode).toBe(201);
      expect(created.body.teacherId).toBe(teacher.id);
      expect(list.statusCode).toBe(200);
      expect(list.body).toEqual([expect.objectContaining({ id: created.body.id, name: "Ana Silva" })]);
    });

    it("should return 404 for a missing teacher relationship", async () => {
      const list = await request(app)
        .get("/teachers/999999/students")
        .set("Authorization", `Bearer ${token}`);
      const create = await request(app)
        .post("/teachers/999999/students")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Ana Silva", age: 15 });

      expect(list.statusCode).toBe(404);
      expect(create.statusCode).toBe(404);
    });
  });
});
