const {Router} = require('express');
const timesheetController = require('../controllers/timesheet/timesheet-controller');
const {loggingMiddleware} = require("../middlewares/logging.middleware");
const {authMiddleware} = require('../middlewares/auth.middleware');
const {editTimesheetValidationSchema} = require('../utils/validation-schemas/timesheet/edit-timesheet');
const {schemaValidation} = require("../middlewares/schema-validation.middleware");
const {rolesValidation} = require("../middlewares/role-validation.middleware");
const {fileExportEmployee} = require("../utils/validation-schemas/timesheet/file-export-employee");
const {fileExport} = require("../utils/validation-schemas/timesheet/file-export");
const {clockInValidationSchema} = require("../utils/validation-schemas/timesheet/clock-in");
const { clockOutValidationSchema } = require("../utils/validation-schemas/timesheet/clock-out");
const { getEmpTimesheetValidationSchema } = require("../utils/validation-schemas/timesheet/get-Emp-Timesheets");
const {ADMIN, SUPERADMIN, MANAGER} = require("../constants/roles");

const router = Router();

router.route('').get(
    loggingMiddleware,
    authMiddleware,
    timesheetController.getTimeSheets
);
//needs a validation schema
router.route('/employee').get(
    loggingMiddleware,
    authMiddleware,
    rolesValidation([ADMIN, SUPERADMIN, MANAGER]),
    schemaValidation({
        schemas: {
            query: getEmpTimesheetValidationSchema,
        },
        validate: ['query']
    }),
    timesheetController.getEmployeeTimeSheets
)

router.route('/latest').get(
    loggingMiddleware,
    authMiddleware,
    timesheetController.getLatestClockRecord
);

router.route('/total').get(
    loggingMiddleware,
    authMiddleware,
    timesheetController.getTotalHours
);

router.route('').post(
    loggingMiddleware,
    authMiddleware,
    schemaValidation({
        schemas: {
            body: clockInValidationSchema,
        },
        validate: ['body']
    }),
    timesheetController.clockIn
);

router.route('').patch(
    loggingMiddleware,
    authMiddleware,
    schemaValidation({
        schemas: {
            body: clockOutValidationSchema,
        },
        validate: ['body']
    }),
    timesheetController.clockOut
);

router.route('/edit').patch(
    loggingMiddleware,
    authMiddleware,
    rolesValidation([ADMIN,SUPERADMIN,MANAGER]),
    schemaValidation({
        schemas: {
            body: editTimesheetValidationSchema,
        },
        validate: ['body']
    }),
    timesheetController.editTimesheet
)

router.route('/csv').get(
    loggingMiddleware,
    authMiddleware,
    rolesValidation([ADMIN,SUPERADMIN,MANAGER]),
    schemaValidation({
        schemas: {
            query: fileExport,
        },
        validate: ['query']
    }),
    timesheetController.getCsvData
);

router.route('/csv/employee').get(
    loggingMiddleware,
    authMiddleware,
    rolesValidation([ADMIN,SUPERADMIN,MANAGER]),
    schemaValidation({
        schemas: {
            query: fileExportEmployee,
        },
        validate: ['query']
    }),
    timesheetController.getEmployeeCSVData,
);

router.route('/pdf').get(
    loggingMiddleware,
    authMiddleware,
    rolesValidation([ADMIN,SUPERADMIN,MANAGER]),
    schemaValidation({
        schemas: {
            query: fileExport,
        },
        validate: ['query']
    }),
    timesheetController.getPDFData
);

router.route('/pdf/employee').get(
    loggingMiddleware,
    authMiddleware,
    rolesValidation([ADMIN,SUPERADMIN,MANAGER]),
    schemaValidation({
        schemas: {
            query: fileExportEmployee,
        },
        validate: ['query']
    }),
    timesheetController.getEmployeePDFData
);

module.exports = router;
