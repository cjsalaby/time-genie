const timesheetService = require('../../services/timesheet-service');
const dateExportService = require('../../services/data-export-service');

const clockIn = async (req, res, next) => {
    try {
        const user = req.user;
        const body = req.body;
        const response = await timesheetService.clockIn(user, body);

        return res.status(201).json(response);
    } catch (error) {
        console.log('Error: ', error);
        return next(error);
    }
}

const clockOut = async (req, res, next) => {
    try {
        const user = req.user;
        const body = req.body;
        const response = await timesheetService.clockOut(user, body);

        return res.status(200).json(response);
    } catch (error) {
        console.log('Error: ', error);
        return next(error);
    }
}

/**
 * Controller logic for retrieving all time sheets from an associated username, company pair
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getTimeSheets = async (req, res, next) => {
    try {
        const user = req.user;
        const response = await timesheetService.getTimeSheets(user);

        return res.status(200).json(response);
    } catch (error) {
        console.log('Error: ', error);
        return next(error);
    }
}

/**
 * Differs from getTimeSheets as this one allows a manager to send a query to
 * get the timesheets of a particular employee,
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
const getEmployeeTimeSheets = async (req, res, next) => {
    try {
        const user = req.user;
        const request = req.query;
        const response = await timesheetService.getEmployeeTimeSheets(request, user);

        return res.status(200).json(response);
    } catch (error) {
        console.log('Error: ', error);
        return next(error);
    }
}

const getLatestClockRecord = async (req, res, next) => {
    try {
        const user = req.user;
        const response = await timesheetService.getLatestClockRecord(user);

        return res.status(200).json(response);
    } catch (error) {
        console.log('Error:', error);
        return next(error);
    }
}

const getTotalHours = async (req, res, next) => {
    try {
        const user = req.user;
        const response = await timesheetService.getTotalHours(user);

        return res.status(200).json(response);
    } catch (error) {
        console.log('Error:', error);
        return next(error);
    }
}

const editTimesheet = async (req, res, next) => {
    try {
        const user = req.user;
        const request = req.body;
        const response = await timesheetService.editTimesheet(user, request);

        return res.status(200).json(response);

    } catch (error) {
        console.log('Error ', error);
        return next(error);
    }
}

const getCsvData = async(req, res, next) => {
    try {
        const user = req.user;
        const query = req.query;
        const csv = await dateExportService.getCSVData(user, query, true);
        res.header('Content-Type', 'text/csv');
        res.attachment('download-' + Date.now() + '.csv');
        return res.status(200).send(csv);
    } catch (error) {
        console.log('Error ', error);
        return next(error);
    }
}

const getEmployeeCSVData = async (req, res, next) => {
    try {
        const user = req.user;
        const request = req.query;
        const csv = await dateExportService.getCSVData(user, request, false);
        res.header('Content-Type', 'text/csv');
        res.attachment('download-' + Date.now() + '.csv');
        return res.status(200).send(csv);
    } catch (error) {
        console.log('Error ', error);
        return next(error);
    }
}

const getPDFData = async (req, res, next) => {
    try {
        const user = req.user;
        const query = req.query;
        const pdfBuffer = await dateExportService.getPDFData(user, query, true);
        res.contentType("application/pdf");
        //res.setHeader('Content-Disposition', 'attachment; filename="output.pdf"');
        res.attachment('employees-export-' + Date.now() + '.pdf');
        return res.status(200).send(pdfBuffer);
    } catch (error) {
        console.log('Error ', error);
        return next(error);
    }
}

const getEmployeePDFData = async (req, res, next) => {
    try {
        const user = req.user;
        const query = req.query;
        const pdfBuffer = await dateExportService.getPDFData(user, query, false);

        res.contentType("application/pdf");
        //res.setHeader('Content-Disposition', 'attachment; filename="output.pdf"');
        res.attachment('employees-export-' + Date.now() + '.pdf');
        return res.status(200).send(pdfBuffer);
    } catch (error) {
        console.log('Error ', error);
        return next(error);
    }
}

module.exports = {
    clockIn,
    clockOut,
    getTimeSheets,
    getLatestClockRecord,
    getTotalHours,
    editTimesheet,
    getEmployeeTimeSheets,
    getCsvData,
    getEmployeeCSVData,
    getPDFData,
    getEmployeePDFData
}
