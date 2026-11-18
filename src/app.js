if (process.env.NODE_ENV !== "test") require("dotenv").config();

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

const requireHttps = process.env.REQUIRE_HTTPS === "true"
  || (process.env.NODE_ENV === "production" && process.env.REQUIRE_HTTPS !== "false");

if (requireHttps) {
  app.set("trust proxy", 1);
  app.use((req, res, next) => {
    if (!req.secure) {
      return res.status(426).json({ message: "HTTPS is required" });
    }
    return next();
  });
}

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
