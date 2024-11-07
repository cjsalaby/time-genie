const jwt = require('jsonwebtoken');

const secret = 'dont-tell-anyone-our-secret!'

// generating a jwt token.
function generateToken(payload) {
    return jwt.sign(payload, secret, {expiresIn: '1h'});
}

// takes in a token and compares it to our secret.
function verifyToken(token) {
    try {
        return jwt.verify(token, secret);

    } catch (err) {
        console.log(err);
        return null;
    }
}

module.exports = {
    generateToken,
    verifyToken,
}