const {forbiddenError, internalServerError} = require("../utils/errors-helper");

const rolesValidation = (rolesToCheckFor) => {
    return async (req, res, next) => {
        try {
            if (!Array.isArray(rolesToCheckFor)) {
                internalServerError();
            }
            const roles = req.user.roles;
            const result = validate(rolesToCheckFor, roles);

            if (result.error) {
                forbiddenError(result.message)
            }
            next();
        } catch (error) {
            console.log(error);
            next(error);
        }

    }
}

function validate(expectedRoles, actualRoles) {
    if (!expectedRoles.some(item => actualRoles.includes(item))) {
        return {
            error: true,
            message: `Forbidden: Not an ${expectedRoles}`
        }
    }
    return  {
        error: false
    }
}

module.exports = {
    rolesValidation
}
