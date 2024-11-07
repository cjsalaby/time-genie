const breakService = require('../../services/break-service')

/**
 * Start a break for the logged-in user.
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const startBreakTime = async (req, res, next) => {
    try {
        const empId = req.user.emp_id;
        const response = await breakService.startBreakTime(empId);

        return res.status(201).json(response);
    } catch (error) {
        console.log('Error: ', error);
        return next(error);
    }
}

/**
 * Stop a break for the logged-in user.
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const stopBreakTime = async (req, res, next) => {
    try {
        const empId = req.user.emp_id;
        const response = await breakService.stopBreakTime(empId);

        return res.status(200).json(response);
    } catch (error) {
        console.log('Error: ', error);
        return next(error);
    }
}

/**
 * Get the latest break record for the logged in user.
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getLatestBreak = async (req, res, next) => {
    try {
        const empId = req.user.emp_id;
        const response = await breakService.getLatestBreak(empId);

        return res.status(200).json(response);
    } catch (error) {
        console.log('Error:', error);
        return next(error);
    }
}

/**
 * Get all the break records for the logged in user.
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getBreaks = async (req, res, next) => {
    try {
        const empId = req.user.emp_id;
        const response = await breakService.getBreaks(empId);

        return res.status(200).json(response);
    } catch (error) {
        console.log('Error:', error);
        return next(error);
    }
}

/**
 * Get all break records from a specific employee.
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getSpecifiedBreaks = async (req, res, next) => {
    try {
        const empId = req.query.emp_id;
        const response = await breakService.getBreaks(empId);

        return res.status(200).json(response);
    } catch (error) {
        console.log('Error:', error);
        return next(error);
    }
}

/**
 * Edits the basic breaks info for an employee.
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const setBreaksInfo = async (req, res, next) => {
    try {
        const empId = req.body.emp_id;
        const maxBreaks = req.body.max_breaks;
        const duration = req.body.break_duration;
        const response = await breakService.setBreaksInfo(empId, maxBreaks, duration);
        return res.status(200).json(response);
    } catch (error) {
        console.log('Error:', error);
        return next(error);
    }
}

/**
 * Returns the break information of the user such as: max_breaks, breaks_remaining and break_duration
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getBreakInfo = async (req, res, next) => {
    try {
        const user = req.user;
        const response = await breakService.getBreakInfo(user);
        return res.status(200).json(response);
    } catch (e) {
        console.log('Error: ', e);
        return next(e)
    }
}

/**
 * Returns the break information of the user such as: max_breaks, breaks_remaining and break_duration
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getFlaggedInfo = async (req, res, next) => {
    try {
        const user = req.user;
        const response = await breakService.getFlaggedInfo(user);
        return res.status(200).json(response);
    } catch (e) {
        console.log('Error: ', e);
        return next(e)
    }
}

/**
 * Returns the break information of the user such as: max_breaks, breaks_remaining and break_duration
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const setFlaggedInfo = async (req, res, next) => {
    try {
        const user = req.user;
        const response = await breakService.setFlaggedInfo(user);
        return res.status(200).json(response);
    } catch (e) {
        console.log('Error: ', e);
        return next(e)
    }
}

/**
 * Edits the breaks remaining based on data from request.
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const editBreaksRemaining = async(req, res, next) => {
    try {
        const {emp_id, breaks_remaining} = req.body;
        const response = await breakService.editBreaksRemaining(emp_id, breaks_remaining);
        return res.status(200).json(response);
    } catch (e) {
        console.log('Error: ', e);
        return next(e)
    }
}

module.exports = {
    startBreakTime,
    stopBreakTime,
    getLatestBreak,
    getBreaks,
    setBreaksInfo,
    getSpecifiedBreaks,
    getBreakInfo,
    getFlaggedInfo,
    setFlaggedInfo,
    editBreaksRemaining
}

