// Centralized error handler
export function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const code = err.code || undefined;

  // Handle common Mongoose errors
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'BadRequest',
      message: `Invalid ${err.path}: ${err.value}`
    });
  }

  if (err.code === 11000) {
    // Duplicate key (e.g., email unique)
    const fields = Object.keys(err.keyPattern || {});
    return res.status(409).json({
      error: 'Conflict',
      message: `Duplicate value for unique field(s): ${fields.join(', ')}`,
      fields
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'ValidationError',
      message: 'Validation failed',
      details: Object.values(err.errors).map(e => ({ field: e.path, message: e.message }))
    });
  }

  return res.status(status).json({
    error: err.name || 'Error',
    message: err.message || 'Internal Server Error',
    ...(code ? { code } : {})
  });
}

// Async route wrapper
export const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Helper to create HTTP errors
export function httpError(status, message, name = 'Error') {
  const e = new Error(message);
  e.status = status;
  e.name = name;
  return e;
}
