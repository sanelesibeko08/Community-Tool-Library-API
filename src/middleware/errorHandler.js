function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return res.end();
  }

  if (error.status !== undefined) {
    return res.status(error.status).json({
      error: error.code || 'ERROR',
      message: error.message
    });
  }

  return res.status(500).json({
    error: 'SERVER_ERROR',
    message: 'An unexpected error occurred'
  });
}

module.exports = errorHandler;
