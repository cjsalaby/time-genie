// Source code provided by TimeGenie Sponsor team

const errorHandlerMiddleware = (error, request, response, next) => {
  console.log(error);

  if (error.errors?.length && error.errors[0].path) {
    error.description = error.errors;
    error.message = 'Bad Request';
  }

  if (error.status === 401) {
    error.description = JSON.stringify(error);
  }

  const payload = {
    success: false,
    statusCode: error.status || 500,
    message: error.status ? error.message : 'Internal Server Error',
  };

  return next(response.status(payload.statusCode).json(payload));
};

module.exports = errorHandlerMiddleware;
