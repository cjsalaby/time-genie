/*
  **SOURCED FROM THE SPONSOR'S DEV TEAM**

  "data" will look like this 
  {
    schemas: { 
      // Joi validation schema
      body: <reference to validation schema>; 
      // Joi validation schema
      query: <reference to validation schema>;
    };'
    // Or ['query'] or ['body', 'query']
    // What piece of request to validate
    validate: ['body']
}
*/
const schemaValidation = (data) => {
  return async (request, response, next) => {
    try {
      const { validate } = data;

      for (const element of validate) {
        const toValidate = request[element];

        const result = data.schemas[element].validate(toValidate);

        if (result.error) {
          const [data] = result.error.details;
          return sendError(response, 400, data?.message || 'Some error occurred...');
        }
      }

      return next();
    } catch (error) {
      console.error('Validation middleware error: ', error);
      return sendError(response, 500, 'Validation failed');
    }
  };
};

const sendError = (response, statusCode, message) =>
  response.status(statusCode).json({
    message,
    success: false,
    statusCode: statusCode,
  });

module.exports = {
  schemaValidation
}
