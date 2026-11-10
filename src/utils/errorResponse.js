function validationError(message) {
  return { status: 400, body: { error: 'VALIDATION_ERROR', message } };
}

function notFoundError(message) {
  return { status: 404, body: { error: 'NOT_FOUND', message } };
}

function serverError(message) {
  return { status: 500, body: { error: 'SERVER_ERROR', message } };
}

function unauthorizedError(message = 'Authentication is required') {
  return { status: 401, body: { error: 'UNAUTHORIZED', message } };
}

function conflictError(message) {
  return { status: 409, body: { error: 'CONFLICT', message } };
}

module.exports = {
  validationError,
  notFoundError,
  serverError,
  unauthorizedError,
  conflictError
};
