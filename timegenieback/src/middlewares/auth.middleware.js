const jwtUtils = require('../utils/jwtUtils');
const {unauthorizedError} = require("../utils/errors-helper");


function authMiddleware(req, res, next) {
    if (req.headers.authorization == null) {
        next(unauthorizedError());
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];

    if (!token) {
        next(unauthorizedError());
    }

    const verify = jwtUtils.verifyToken(token);

    if (!verify) {
        next(unauthorizedError('Invalid Token'));
    }

    req.user = verify;
    next();
}

module.exports = {
    authMiddleware,
}