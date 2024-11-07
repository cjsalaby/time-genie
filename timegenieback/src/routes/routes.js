const Router = require('express');
const employee = require('./employee-routes');
const timesheet = require('./timesheet-routes');
const task = require('./task-routes');
const login = require('./login-routes');
const project = require('./project-routes');
const company = require('./company-routes');
const timetracking = require('./time-tracking-routes');
const breaks = require('./break-routes');
const geofence = require('./geofence-routes');
const timechange = require('./timechange-request-routes');

const router = Router();

router.use('/employee', employee);
router.use('/timesheet', timesheet);
router.use('/task', task);
router.use('/login', login);
router.use('/project', project);
router.use('/company', company);
router.use('/timetracking', timetracking);
router.use('/break', breaks);
router.use('/geofence', geofence);
router.use('/timechange', timechange)

module.exports = router;
