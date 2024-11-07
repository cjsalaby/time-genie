const bcrypt = require('bcrypt');

const saltRounds = 10;

/**
 * This function takes in a plaintext password, salts and hashes it.
 *
 * @param {plain text password} password
 * @returns hashed password
 */
function hashPassword(password) {
    return bcrypt.hashSync(password, saltRounds);
}

/**
 * Compares a plaintext password to the hashpassword that is stored in the db.
 *
 * @param {plain text password} password
 * @param {hashed password} hashedPassword
 * @returns true if passwords match else false
 */
function verifyPassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
}

module.exports = {
    hashPassword,
    verifyPassword,
}