const ApiErrorController = {
  
  // Handle validation errors
  handleValidationError: (res, error) => {
    const errors = {};
    
    if (error.name === 'ValidationError') {
      Object.keys(error.errors).forEach(field => {
        errors[field] = error.errors[field].message;
      });
    }

    res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'Invalid input data',
      details: errors
    });
  },

  // Handle not found errors
  handleNotFound: (res, resource = 'Resource') => {
    res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `${resource} not found`
    });
  },

  // Handle unauthorized errors
  handleUnauthorized: (res, message = 'Unauthorized access') => {
    res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: message
    });
  },

  // Handle forbidden errors
  handleForbidden: (res, message = 'Access forbidden') => {
    res.status(403).json({
      success: false,
      error: 'Forbidden',
      message: message
    });
  },

  // Handle server errors
  handleServerError: (res, error, message = 'Internal server error') => {
    console.error('API Error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: message,
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  },

  // Handle database errors
  handleDatabaseError: (res, error) => {
    if (error.name === 'MongoServerError' && error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'Conflict',
        message: 'Resource already exists'
      });
    }

    ApiErrorController.handleServerError(res, error, 'Database operation failed');
  },

  // Handle general errors
  handleError: (res, error) => {
    if (error.name === 'ValidationError') {
      return ApiErrorController.handleValidationError(res, error);
    }
    
    if (error.name === 'MongoServerError') {
      return ApiErrorController.handleDatabaseError(res, error);
    }

    ApiErrorController.handleServerError(res, error);
  }
};

module.exports = { ApiErrorController }; 