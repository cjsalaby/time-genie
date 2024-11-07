const {Router} = require('express');
const timeTrackingController = require('../controllers/timesheet/time-tracking-controller');
const {loggingMiddleware} = require("../middlewares/logging.middleware");
const {authMiddleware} = require('../middlewares/auth.middleware');
const {schemaValidation} = require("../middlewares/schema-validation.middleware");
const {startTimeValidationSchema} = require("../utils/validation-schemas/time-tracking/start-time");
const {stopTimeValidationSchema} = require("../utils/validation-schemas/time-tracking/stop-time");
const {getProjectTimeValidationSchema} = require("../utils/validation-schemas/time-tracking/get-project-time");
const {getTaskTimeValidationSchema} = require("../utils/validation-schemas/time-tracking/get-task-time");
const router = Router();

//Trevor Delete after current branch looks good for validation

router.route('').post(
    loggingMiddleware,
    authMiddleware,
    schemaValidation({
        schemas: {
            body: startTimeValidationSchema,
        },
        validate: ['body']
    }),
    timeTrackingController.startTime
);

router.route('').patch(
    loggingMiddleware,
    authMiddleware,
    schemaValidation({
        schemas: {
            body: stopTimeValidationSchema,
        },
        validate: ['body']
    }),
    timeTrackingController.stopTime
);

router.route('/project').get(
    loggingMiddleware,
    authMiddleware,
    schemaValidation({
        schemas: {
            query: getProjectTimeValidationSchema,
        },
        validate: ['query']
    }),
    timeTrackingController.getTotalProjectTime
);

router.route('/task').get(
    loggingMiddleware,
    authMiddleware,
    schemaValidation({
        schemas: {
            query: getTaskTimeValidationSchema,
        },
        validate: ['query']
    }),
    timeTrackingController.getTotalTaskTime
);

router.route('/project/events').get(
    loggingMiddleware,
    authMiddleware,
    schemaValidation({
        schemas: {
            query: getProjectTimeValidationSchema,
        },
        validate: ['query']
    }),
    timeTrackingController.getProjectTimeTrackingEvents
);

router.route('/task/events').get(
    loggingMiddleware,
    authMiddleware,
    schemaValidation({
        schemas: {
            query: getTaskTimeValidationSchema,
        },
        validate: ['query']
    }),
    timeTrackingController.getTaskTimeTrackingEvents
);

module.exports = router;