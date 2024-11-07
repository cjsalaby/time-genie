const {Router} = require('express');
const ProjectController = require('../controllers/project/project-controller.js');
const {loggingMiddleware} = require("../middlewares/logging.middleware");
const {authMiddleware} = require('../middlewares/auth.middleware');
const {schemaValidation} = require("../middlewares/schema-validation.middleware");
const {createProjectValidationSchema} = require("../utils/validation-schemas/project/create-project");
const {updateProjectValidationSchema} = require("../utils/validation-schemas/project/update-project");
const {deleteProjectValidationSchema} = require("../utils/validation-schemas/project/delete-project");
const {assignEmployeeProjectValidationSchema} = require("../utils/validation-schemas/project/assign-employee");
const {getProjectValidationSchema} = require("../utils/validation-schemas/project/get-project");
const {rolesValidation} = require("../middlewares/role-validation.middleware");
const {ADMIN, SUPERADMIN, MANAGER} = require("../constants/roles");

const router = Router();

/**
 * Get a project using the projectId
 */
router.route('').get(
    loggingMiddleware,
    authMiddleware,
    rolesValidation([ADMIN,SUPERADMIN,MANAGER]),
    schemaValidation({
        schemas: {
            query: getProjectValidationSchema
        },
        validate: ['query']
    }),
    ProjectController.getProject
);

router.route('').delete(
    loggingMiddleware,
    authMiddleware,
    rolesValidation([ADMIN,SUPERADMIN,MANAGER]),
    schemaValidation({
        schemas: {
            query: deleteProjectValidationSchema
        },
        validate: ['query']
    }),
    ProjectController.deleteProject
)

/**
 * Get the current project for an employee no needed validation may want role validation
 */
router.route('/current').get(
    loggingMiddleware,
    authMiddleware,
    ProjectController.getCurrentProject
);

/**
 * Get all projects for the company
 */
router.route('/all').get(
    loggingMiddleware,
    authMiddleware,
    rolesValidation([ADMIN,SUPERADMIN,MANAGER]),
    ProjectController.getAllProjects
);

/**
 * Create a new project
 */
router.route('').put(
    loggingMiddleware,
    authMiddleware,
    rolesValidation([ADMIN,SUPERADMIN,MANAGER]),
    schemaValidation({
        schemas: {
            body: createProjectValidationSchema
        },
        validate: ['body']
    }),
    ProjectController.createProject
);

/**
 * Update a project
 */
router.route('').patch(
    loggingMiddleware,
    authMiddleware,
    rolesValidation([ADMIN,SUPERADMIN,MANAGER]),
    schemaValidation({
        schemas: {
            body: updateProjectValidationSchema
        },
        validate: ['body']
    }),
    ProjectController.updateProject
);

/**
 * Get all assigned projects for the user associated with the token may want role validation
 */
router.route('/assign').get(
    loggingMiddleware,
    authMiddleware,
    ProjectController.getAssignedProjects
)

/**
 * Manager assigns an employee to a project
 */
router.route('/assign').patch(
    loggingMiddleware,
    authMiddleware,
    rolesValidation([ADMIN,SUPERADMIN,MANAGER]),
    schemaValidation({
        schemas: {
            body: assignEmployeeProjectValidationSchema
        },
        validate: ['body']
    }),
    ProjectController.assignEmployee
);

router.route('/latest').get(
    loggingMiddleware,
    authMiddleware,
    ProjectController.getLatestProject,
)

module.exports = router;
