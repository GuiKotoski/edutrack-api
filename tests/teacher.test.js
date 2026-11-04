const request = require("supertest");
const app = require("../src/app");

describe("Teacher Endpoints", () => {
  describe("GET /teachers", () => {
    it("should return all teachers", async () => {
      const response = await request(app).get("/teachers");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);

      expect(response.body[0]).toHaveProperty("id");
      expect(response.body[0]).toHaveProperty("name");
      expect(response.body[0]).toHaveProperty("email");
    });
  });

  describe("GET /teachers/:id", () => {
    it("should return a teacher", async () => {
      const response = await request(app).get("/teachers/1");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("name");
      expect(response.body).toHaveProperty("email");
    });

      it("should return 404 when teacher does not exist", async () => {
      const response = await request(app).get("/teachers/999");

      expect(response.statusCode).toBe(404);
  });
});

    describe("POST /teachers", () => {
    it("should create a teacher", async () => {
      const response = await request(app)
        .post("/teachers")
        .send({
          name: "Ana Souza",
          email: "ana@email.com",
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.name).toBe("Ana Souza");
      expect(response.body.email).toBe("ana@email.com");
    });
  });
      describe("PUT /teachers/:id", () => {
    it("should update a teacher", async () => {
      const response = await request(app)
        .put("/teachers/1")
        .send({
          name: "Carlos Updated",
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.name).toBe("Carlos Updated");
    });
  });

      describe("DELETE /teachers/:id", () => {
    it("should delete a teacher", async () => {
      const response = await request(app)
        .delete("/teachers/1");

      expect(response.statusCode).toBe(204);
    });
  });
});