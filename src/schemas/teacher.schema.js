const { z } = require("zod");

const teacherSchema = z.object({
  name: z.string().trim().min(3, "Nome deve ter pelo menos 3 caracteres"),
  subject: z.string().trim().min(3, "Disciplina deve ter pelo menos 3 caracteres"),
});

const updateTeacherSchema = teacherSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  "Informe ao menos um campo para atualizar"
);

module.exports = { teacherSchema, updateTeacherSchema };
