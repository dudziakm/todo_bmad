export function errorHandler(err, _req, res, _next) {
  console.error("Unhandled error:", err.message);

  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred",
    },
  });
}
