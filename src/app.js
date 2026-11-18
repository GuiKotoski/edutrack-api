const express = require("express");
const authRoutes = require("./routes/authRoutes");

const teacherRoutes = require(
  "./routes/teacherRoutes"
);

const studentRoutes = require(
  "./routes/studentRoutes"
);
const errorHandler = require("./middleware/errorHandler");
const swaggerUi = require("swagger-ui-express");
const openapiDocument = require("../docs/openapi.json");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "EduTrack API Online",
  });
});

app.get("/openapi.json", (req, res) => res.json(openapiDocument));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiDocument, {
  customSiteTitle: "EduTrack API — Swagger UI",
}));

app.use("/teachers", teacherRoutes);
app.use("/students", studentRoutes);
app.use("/auth", authRoutes);
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});
app.use(errorHandler);

module.exports = app;
