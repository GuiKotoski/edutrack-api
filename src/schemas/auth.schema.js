const { z } = require("zod");

const registerSchema = z.object({
  name: z.string().trim().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().trim().email("Email inválido"),
  password: z.string()
    .min(12, "Senha deve ter pelo menos 12 caracteres")
    .max(72, "Senha deve ter no máximo 72 caracteres"),
});

const loginSchema = z.object({
  email: z.string().trim().email("Email inválido"),
  // Keep the existing minimum for login so current accounts remain usable.
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres").max(72),
});

module.exports = { registerSchema, loginSchema };
