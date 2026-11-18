const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthService {
  async register({ name, email, password }) {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      const error = new Error("Email already registered");
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  async login({ email, password }) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) {
      throw new Error("JWT_SECRET must contain at least 32 characters");
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      secret,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
      }
    );

    return { token };
  }
}

module.exports = new AuthService();
