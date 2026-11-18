require("dotenv").config();
process.env.JWT_SECRET = "edutrack-test-secret-with-more-than-32-characters";
process.env.JWT_EXPIRES_IN = "1h";
