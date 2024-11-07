const {Router} = require('express');
const companyController = require('../controllers/company/company-controller');
const {loggingMiddleware} = require("../middlewares/logging.middleware");
const {authMiddleware} = require('../middlewares/auth.middleware');
const {schemaValidation} = require('../middlewares/schema-validation.middleware');
const {createCompanyValidationSchema} = require('../utils/validation-schemas/company/create-company');
const {updateCompanyValidationSchema} = require('../utils/validation-schemas/company/update-company');
const {rolesValidation} = require("../middlewares/role-validation.middleware");
const {ADMIN, SUPERADMIN} = require("../constants/roles");
const {updateCompanyTimezoneValidationSchema} = require("../utils/validation-schemas/company/update-company-timezone");
const {updateCompanyClockOutValidationSchema} = require("../utils/validation-schemas/company/update-company-clock-out");

const router = Router();

//Trevor Delete after current branch looks good for validation

router.route('').put(
    loggingMiddleware,
    authMiddleware,
    rolesValidation([ADMIN, SUPERADMIN]),
    schemaValidation({
        schemas: {
            body: createCompanyValidationSchema
        },
        validate: ['body']
    }),
    companyController.createCompany
);

router.route('').get(
    loggingMiddleware,
    authMiddleware,
    companyController.getCompany
);

router.route('').patch(
    loggingMiddleware,
    authMiddleware,
    rolesValidation([ADMIN, SUPERADMIN]),
    schemaValidation({
        schemas: {
            body: updateCompanyValidationSchema
        },
        validate: ['body']
    }),
    companyController.updateCompany
);

router.route('/timezone').patch(
    loggingMiddleware,
    authMiddleware,
    rolesValidation([ADMIN, SUPERADMIN]),
    schemaValidation({
        schemas: {
            body: updateCompanyTimezoneValidationSchema
        },
        validate: ['body']
    }),
    companyController.updateCompanyTimezone
)

router.route('/clock').patch(
    loggingMiddleware,
    authMiddleware,
    rolesValidation([ADMIN, SUPERADMIN]),
    schemaValidation({
        schemas: {
            body: updateCompanyClockOutValidationSchema
        },
        validate: ['body']
    }),
    companyController.updateCompanyClockOutCronJob
)

module.exports = router;
