const { z } = require('zod');

const studentSchema = z.object({
  name: z.string().trim().min(3, "Nome deve ter pelo menos 3 caracteres"),

  age: z
    .number()
    .int()
    .min(1, 'Idade inválida')
    .max(120, 'Idade inválida')
});

const updateStudentSchema = studentSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  "Informe ao menos um campo para atualizar"
);

module.exports = { studentSchema, updateStudentSchema };
