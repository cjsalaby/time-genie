const {Router} = require('express');
const taskController = require('../controllers/project/task-controller');
const {loggingMiddleware} = require("../middlewares/logging.middleware");
const {authMiddleware} = require('../middlewares/auth.middleware');
const {schemaValidation} = require("../middlewares/schema-validation.middleware");
const {getTaskValidationSchema} = require("../utils/validation-schemas/task/get-task");
const {getProjectTasksValidationSchema} = require("../utils/validation-schemas/task/get-project-tasks");
const {createTaskValidationSchema} = require("../utils/validation-schemas/task/create-task");
const {updateTaskValidationSchema} = require("../utils/validation-schemas/task/update-task");
const {deleteTaskValidationSchema} = require("../utils/validation-schemas/task/delete-task");
const {assignEmployeeTaskValidationSchema} = require("../utils/validation-schemas/task/assign-employee");
const {assignTaskValidationSchema} = require("../utils/validation-schemas/task/assign");
const {rolesValidation} = require("../middlewares/role-validation.middleware");
const {ADMIN, SUPERADMIN, MANAGER} = require("../constants/roles");

const router = Router();

//Trevor Delete after current branch looks good for validation

router.route('').get(
    loggingMiddleware,
    authMiddleware,
    schemaValidation({
        schemas: {
            query: getTaskValidationSchema
        },
        validate: ['query']
    }),
    taskController.getTask
);

router.route('').put(
    loggingMiddleware,
    authMiddleware,
    schemaValidation({
        schemas: {
            body: createTaskValidationSchema
        },
        validate: ['body']
    }),
    taskController.createTask
);

router.route('').patch(
    loggingMiddleware,
    authMiddleware,
    schemaValidation({
        schemas: {
            body: updateTaskValidationSchema
        },
        validate: ['body']
    }),
    taskController.updateTask
);

router.route('').delete(
    loggingMiddleware,
    authMiddleware,
    schemaValidation({
        schemas: {
            query: deleteTaskValidationSchema
        },
        validate: ['query']
    }),
    taskController.deleteTask
)

router.route('/project').get(
    loggingMiddleware,
    authMiddleware,
    schemaValidation({
        schemas: {
            query: getProjectTasksValidationSchema
        },
        validate: ['query']
    }),
    taskController.getProjectTasks
);

router.route('/assign/employee').patch(
    loggingMiddleware,
    authMiddleware,
    rolesValidation([ADMIN,SUPERADMIN,MANAGER]),
    schemaValidation({
        schemas: {
            body: assignEmployeeTaskValidationSchema
        },
        validate: ['body']
    }),
    taskController.assignEmployee
);

router.route('/assign').patch(
    loggingMiddleware,
    authMiddleware,
    schemaValidation({
        schemas: {
            body: assignTaskValidationSchema
        },
        validate: ['body']
    }),
    taskController.assignSelf
)

router.route('/latest').get(
    loggingMiddleware,
    authMiddleware,
    taskController.getLatestTask,
)

module.exports = router;
