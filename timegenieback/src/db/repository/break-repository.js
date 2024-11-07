const { BreakTimeTracking } = require('../../models/breaks');

const sequelize = require('../db');

/**
 * Create a new break record and timestamps the start time in the database for the input employee.
 *
 * @param employee_id
 * @returns {Promise<*>}
 */
const startBreakTime = async (employee_id) => {
    return await BreakTimeTracking.create({
        employee_id: employee_id,
        start_time: sequelize.fn('now')
    });
}

/**
 * Edits number of breaks remaining for an employee in database
 *
 * @param employee
 * @param newBreaksRemaining
 * @returns {Promise<Model|null>}
 */
const setRemainingBreaks = async (employee, newBreaksRemaining) => {
    await employee.set({
        breaks_remaining: newBreaksRemaining
    });
    await employee.save();
    return {
        breaks_remaining: employee.dataValues.breaks_remaining
    }
}

/**
 * Timestamps the stop time in the database for the input break record.
 *
 * @param breakRecord
 * @returns {Promise<*>}
 */
const stopBreakTime = async (breakRecord) => {
    await breakRecord.set({
        stop_time: sequelize.fn('now'),
        in_progress: false
    });
    return await breakRecord.save();
}

/**
 * Get the latest break record from the database for a specific employee.
 *
 * @param employee_id
 * @returns {Promise<Model|null>}
 */
const getLatestBreak = async (employee_id) => {
    return await BreakTimeTracking.findOne({
        where: {
            employee_id: employee_id,
        },
        order: [['break_id', 'DESC']]
    });
}

/**
 * Get all the break records from the database for a specific employee.
 *
 * @param employee_id
 * @returns {Promise<Model[]>}
 */
const getBreaks = async (employee_id) => {
    return await BreakTimeTracking.findAll({
        where: {
            employee_id: employee_id,
        },
        order: [['break_id', 'DESC']]
    });
}

/**
 * Resets number of breaks remaining, max breaks,
 * and break duration for an employee in database.
 *
 * @param employee
 * @param maxBreaks
 * @param duration
 * @returns {Promise<Model|null>}
 */
const setBreaks = async (employee, maxBreaks, duration) => {
     await employee.set({
        max_breaks: maxBreaks,
        breaks_remaining: maxBreaks,
        break_duration: duration
     });
    await employee.save();
    return  {
        max_breaks: employee.dataValues.max_breaks,
        breaks_remaining: employee.dataValues.breaks_remaining,
        break_duration: employee.dataValues.break_duration
    }
}

/**
 * Resets number of breaks remaining, max breaks,
 * and break duration for an employee in database.
 *
 * @returns {Promise<Model|null>}
 * @param breakRecord
 */
const setFlaggedInfo = async (breakRecord) => {
    await breakRecord.set({
        is_flagged: true
    });
    await breakRecord.save();
    return {
        break_id: breakRecord.break_id,
        employee_id: breakRecord.employee_id,
        is_flagged: breakRecord.is_flagged,
        in_progress: breakRecord.in_progress,
        start_time: breakRecord.start_time,
        stop_time: breakRecord.stop_time,
        scheduled_stop_time: breakRecord.scheduled_stop_time,
    };
}

module.exports = {
    startBreakTime,
    setRemainingBreaks,
    stopBreakTime,
    getLatestBreak,
    getBreaks,
    setFlaggedInfo,
    setBreaks
}
