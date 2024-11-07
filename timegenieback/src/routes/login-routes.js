const {Router} = require('express');
const authController = require('../controllers/auth/auth-controller');
const {loggingMiddleware} = require("../middlewares/logging.middleware");
const {authMiddleware} = require('../middlewares/auth.middleware');
const {schemaValidation} = require('../middlewares/schema-validation.middleware');
const {loginValidationSchema} = require('../utils/validation-schemas/auth/login');
const {updatePasswordValidationSchema} = require('../utils/validation-schemas/auth/update-password');

const router = Router();

//Trevor Delete after current branch looks good for validation

router.route('').post(
    loggingMiddleware,
    schemaValidation({
        schemas: {
            body: loginValidationSchema
        },
        validate: ['body']
    }),
    authController.login
);

router.route('').patch(
    loggingMiddleware,
    authMiddleware,
    schemaValidation({
        schemas: {
            body: updatePasswordValidationSchema
        },
        validate: ['body']
    }),
    authController.updatePassword
);

module.exports = router;