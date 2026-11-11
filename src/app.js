const express = require("express");
const authRoutes = require("./routes/authRoutes");

const teacherRoutes = require(
  "./routes/teacherRoutes"
);

const studentRoutes = require(
  "./routes/studentRoutes"
);

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "EduTrack API Online",
  });
});

app.use("/teachers", teacherRoutes);
app.use("/students", studentRoutes);
app.use("/auth", authRoutes);

module.exports = app;