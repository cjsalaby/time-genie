const { format } = require("date-fns");

/**
 * Utility function for logging request information to the console
 *
 * @param req
 * @param res
 * @param next
 */
function loggingMiddleware(req, res, next) {
    console.log("\n#####################################################################");
    console.log(`Received request for ${req.originalUrl} at: ` + format(new Date(),'MM/dd/yyyy HH:mm:ss'));
    console.log('Request Method: ', req.method);
    console.log('Request Query: ', req.query);
    console.log('Request Parameters: ', req.parameters);
    console.log('Request body: ');
    console.log(req.body);
    console.log("#####################################################################\n");
    next();
}

module.exports = {
    loggingMiddleware
}