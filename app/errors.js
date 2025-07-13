// Factory function for ValidationError
const createValidationError = (message, errors = null) => {
  const err = new Error(message);
  err.name = 'ValidationError';
  if (errors) err.errors = errors;
  return err;
};

module.exports = { createValidationError }; 