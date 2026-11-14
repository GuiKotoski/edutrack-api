function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ message: "Invalid JSON body" });
  }

  if (Number.isInteger(err.statusCode) && err.statusCode >= 400 && err.statusCode < 500) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err.code === "P2025") {
    return res.status(404).json({ message: "Resource not found" });
  }
  if (err.code === "P2002") {
    return res.status(409).json({ message: "Resource already exists" });
  }

  return res.status(500).json({
    message: "Internal Server Error",
  });
}

module.exports = errorHandler;
