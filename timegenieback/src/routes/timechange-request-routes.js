const {Router} = require("express");
const timeChangeRequestController = require('../controllers/timesheet/timechange-request-controller');
const {loggingMiddleware} = require("../middlewares/logging.middleware");
const {authMiddleware} = require("../middlewares/auth.middleware");
const {schemaValidation} = require("../middlewares/schema-validation.middleware");
const {rolesValidation} = require("../middlewares/role-validation.middleware");
const {ADMIN, SUPERADMIN, MANAGER} = require("../constants/roles");
const {addApprovalValidationSchema} = require("../utils/validation-schemas/timechange-request/add-approval");
const {createTimeChangeRequestValidationSchema} = require("../utils/validation-schemas/timechange-request/create-timechange-request");
const router = Router();

//Trevor Delete after current branch looks good for validation

router.route('').get(
    loggingMiddleware,
    authMiddleware,
    timeChangeRequestController.getEmployeeTimeChangeRequests
);

router.route('').post(
    loggingMiddleware,
    authMiddleware,
    schemaValidation({
        schemas: {
            body: createTimeChangeRequestValidationSchema,
        },
        validate: ['body']
    }),
    timeChangeRequestController.addTimeChangeRequest
);

router.route('').patch(
    loggingMiddleware,
    authMiddleware,
    rolesValidation([MANAGER]),
    schemaValidation({
        schemas: {
            body: addApprovalValidationSchema,
        },
        validate: ['body']
    }),
    timeChangeRequestController.setApproval
);

router.route('/all').get(
    loggingMiddleware,
    authMiddleware,
    rolesValidation([ADMIN, SUPERADMIN, MANAGER]),
    timeChangeRequestController.getAllManagerEmployeeTimeChangeRequests
);

module.exports = router;
