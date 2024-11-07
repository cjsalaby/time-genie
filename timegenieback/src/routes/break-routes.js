const { Router } = require('express');
const breakController = require('../controllers/timesheet/break-controller');
const { loggingMiddleware } = require("../middlewares/logging.middleware");
const { authMiddleware } = require('../middlewares/auth.middleware');
const { schemaValidation } = require('../middlewares/schema-validation.middleware');
const { rolesValidation } = require("../middlewares/role-validation.middleware");
const { ADMIN, SUPERADMIN, MANAGER } = require("../constants/roles");
const { setBreaksValidationSchema } = require('../utils/validation-schemas/breaks/set-breaks');
const { getSpecifiedBreaksValidationSchema } = require("../utils/validation-schemas/breaks/get-specified-breaks");
const { editBreaksRemainingValidationSchema } = require("../utils/validation-schemas/breaks/edit-breaks-remaining");

const router = Router();

//Trevor Delete after current branch looks good for validation

/**
 * Start an employee's break.
 */
router.route('').post(
    loggingMiddleware,
    authMiddleware,
    breakController.startBreakTime
);

/**
 * Stop an employee's break.
 */
router.route('').patch(
    loggingMiddleware,
    authMiddleware,
    breakController.stopBreakTime
);

/**
 * Get the latest break record for the logged-in user.
 */
router.route('/latest').get(
    loggingMiddleware,
    authMiddleware,
    breakController.getLatestBreak
);

/**
 * Get all the breaks for the logged-in user.
 */
router.route('').get(
    loggingMiddleware,
    authMiddleware,
    breakController.getBreaks
);

/**
 * Edit the break info details for a specific employee.
 */
router.route('/manager').patch(
    loggingMiddleware,
    authMiddleware,
    rolesValidation([ADMIN, SUPERADMIN, MANAGER]),
    schemaValidation({
        schemas: {
            body: setBreaksValidationSchema,
        },
        validate: ['body']
    }),
    breakController.setBreaksInfo
);

/**
 * Get all the break records for a specific employee.
 */
router.route('/target').get(
    loggingMiddleware,
    authMiddleware,
    rolesValidation([ADMIN, SUPERADMIN, MANAGER]),
    schemaValidation({
        schemas: {
            query: getSpecifiedBreaksValidationSchema
        },
        validate: ['query']
    }),
    breakController.getSpecifiedBreaks
);

/**
 * Route for logged in employee to get their breaks' info.
 */
router.route('/info').get(
    loggingMiddleware,
    authMiddleware,
    breakController.getBreakInfo
);

/**
 * Route for logged in employee to get their breaks' flag info.
 */
router.route('/flag').get(
    loggingMiddleware,
    authMiddleware,
    breakController.getFlaggedInfo
);

/**
 * sets the flag to true
 */
router.route('/flag').patch(
    loggingMiddleware,
    authMiddleware,
    breakController.setFlaggedInfo
);

/**
 * Route for manager to manually edit breaks remaining for an employee
 */
router.route('/remaining').patch(
    loggingMiddleware,
    authMiddleware,
    rolesValidation([ADMIN, SUPERADMIN, MANAGER]),
    schemaValidation({
        schemas: {
            body: editBreaksRemainingValidationSchema
        },
        validate: ['body']
    }),
    breakController.editBreaksRemaining
);

module.exports = router;
