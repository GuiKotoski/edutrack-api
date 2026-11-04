const express = require("express");
const cors = require("cors");

const teacherRoutes = require("./routes/teacherRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "EduTrack API Online",
  });
});

app.use("/teachers", teacherRoutes);

module.exports = app;
