const {Router} = require('express');
const employeeController = require('../controllers/employee/employee-controller');
const {loggingMiddleware} = require("../middlewares/logging.middleware");
const {schemaValidation} = require('../middlewares/schema-validation.middleware');
const {createEmployeeValidationSchema} = require('../utils/validation-schemas/employee/create-employee');
const {updateEmployeeValidationSchema} = require('../utils/validation-schemas/employee/update-employee');
const {deleteEmployeeValidationSchema} = require('../utils/validation-schemas/employee/delete-employee');
const {getAllEmployeesFromCompanyValidationSchema} = require('../utils/validation-schemas/employee/get-all-employees');
const {authMiddleware} = require('../middlewares/auth.middleware');
const {rolesValidation} = require("../middlewares/role-validation.middleware");
const {ADMIN, SUPERADMIN, MANAGER} = require("../constants/roles");

const router = Router();

//Trevor Delete after current branch looks good for validation

router.route('').put(
    loggingMiddleware,
    authMiddleware,
    rolesValidation([ADMIN,SUPERADMIN,MANAGER]),
    schemaValidation({
        schemas: {
            body: createEmployeeValidationSchema
        },
        validate: ['body']
    }),
    employeeController.createEmployee
);

router.route('').get(
    loggingMiddleware,
    authMiddleware,
    employeeController.getEmployee
);

router.route('').patch(
    loggingMiddleware,
    authMiddleware,
    rolesValidation([ADMIN,SUPERADMIN,MANAGER]),
    schemaValidation({
        schemas: {
            body: updateEmployeeValidationSchema
        },
        validate: ['body']
    }),
    employeeController.updateEmployee
);

router.route('').delete(
    loggingMiddleware,
    authMiddleware,
    rolesValidation([ADMIN,SUPERADMIN,MANAGER]),
    schemaValidation({
        schemas: {
            query: deleteEmployeeValidationSchema
        },
        validate: ['query']
    }),
    employeeController.deleteEmployee
);

router.route('/company').get(
    loggingMiddleware,
    authMiddleware,
    schemaValidation({
        schemas: {
            query: getAllEmployeesFromCompanyValidationSchema,
        },
        validate: ['query']
    }),
    rolesValidation([ADMIN,SUPERADMIN,MANAGER]),
    employeeController.getAllEmployeesFromCompany
);

router.route('/manager').get(
    loggingMiddleware,
    authMiddleware,
    rolesValidation([ADMIN, SUPERADMIN, MANAGER]),
    employeeController.getManagerEmployees
)

router.route('/latest').get(
    loggingMiddleware,
    authMiddleware,
    rolesValidation([ADMIN, SUPERADMIN, MANAGER]),
    employeeController.getLatestEmployee
)

module.exports = router;
