require("dotenv").config();

const app = require("./app");
const jwt = require("jsonwebtoken");

const PORT = process.env.PORT || 3000;
const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "1d";

if (!jwtSecret || jwtSecret.length < 32) {
  throw new Error("JWT_SECRET must be configured with at least 32 characters");
}

try {
  jwt.sign({ startupCheck: true }, jwtSecret, { expiresIn: jwtExpiresIn });
} catch {
  throw new Error("JWT_EXPIRES_IN must be a valid positive JWT duration");
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
