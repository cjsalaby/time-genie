const createError = require('http-errors');

/**
 * The following source code was given by the TimeGenie team.
 * Slight modifications were made to change how the module exported the functions.
 */

const badRequestError = (message = 'Bad Request', description) => {
  throw createError(400, message, { description });
};

const unauthorizedError = (message = 'Unauthorized', description) => {
  throw  createError(401, message, { description });
};

const forbiddenError = (message = 'Forbidden', description) => {
  throw createError(403, message, { description });
};

const notFoundError = (message = 'Not Found', description) => {
  throw createError(404, message, { description });
};

const conflictError = (message = 'Conflict', description) => {
  throw createError(409, message, { description });
};

const internalServerError = (message = 'Internal Server Error', description) => {
  throw createError(500, message, { description });
};

module.exports = {
  badRequestError,
  unauthorizedError,
  forbiddenError,
  notFoundError,
  conflictError,
  internalServerError
}

