const {Router} = require('express');
const GeofenceController = require('../controllers/geofence/geofence-controller');
const {loggingMiddleware} = require("../middlewares/logging.middleware");
const {authMiddleware} = require('../middlewares/auth.middleware');
const {rolesValidation} = require("../middlewares/role-validation.middleware");
const {schemaValidation} = require("../middlewares/schema-validation.middleware");
const {createGeofenceValidationSchema} = require('../utils/validation-schemas/geofence/create-geofence');
const {getGeofenceValidationSchema} = require('../utils/validation-schemas/geofence/get-geofence');
const {deleteGeofenceValidationSchema} = require("../utils/validation-schemas/geofence/delete-geofence");
const {updateGeofenceValidationSchema} = require("../utils/validation-schemas/geofence/update-geofence");
const {SUPERADMIN, MANAGER} = require("../constants/roles");

const router = Router();

//Trevor Delete after current branch looks good for validation

router.route('').post(
    loggingMiddleware,
    authMiddleware,
    rolesValidation([SUPERADMIN, MANAGER]),
    schemaValidation({
        schemas: {
            body: createGeofenceValidationSchema
        },
        validate: ['body']
    }),
    GeofenceController.createGeofence,
);

router.route('').get(
    loggingMiddleware,
    authMiddleware,
    GeofenceController.getSelfGeofence,
)

router.route('/employee').get(
    loggingMiddleware,
    authMiddleware,
    rolesValidation([SUPERADMIN, MANAGER]),
    schemaValidation({
        schemas: {
            query: getGeofenceValidationSchema
        },
        validate: ['query']
    }),
    GeofenceController.getGeofenceById,
)

router.route('').delete(
    loggingMiddleware,
    authMiddleware,
    rolesValidation([SUPERADMIN,MANAGER]),
    schemaValidation({
        schemas: {
            query: deleteGeofenceValidationSchema,
        },
        validate: ['query']
    }),
    GeofenceController.deleteGeofence,
)

router.route('').patch(
    loggingMiddleware,
    authMiddleware,
    rolesValidation([SUPERADMIN,MANAGER]),
    schemaValidation({
        schemas: {
            body: updateGeofenceValidationSchema,
        },
        validate: ['body']
    }),
    GeofenceController.updateGeofence
)

module.exports = router;
