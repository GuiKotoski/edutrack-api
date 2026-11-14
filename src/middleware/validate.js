const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const result = schema.safeParse(req[property]);
    if (!result.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues.map(({ path, message, code }) => ({
          path,
          message,
          code,
        })),
      });
    }

    req[property] = result.data;
    return next();
  };
};

module.exports = validate;
