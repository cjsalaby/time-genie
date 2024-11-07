const {Timesheet} = require('../../models/timesheet');
const sequelize = require('../db');

const clockIn = async (emp_id, geolocation, in_region, is_approved) => {
    return await Timesheet.create({
        emp_id: emp_id,
        clock_in_location: geolocation,
        clock_in_region: in_region,
        clock_in_is_approved: is_approved,
    });
}

const clockOut = async (timesheet, geolocation, in_region, is_approved) => {
    await timesheet.set({
        clock_out_time: sequelize.literal('CURRENT_TIMESTAMP'),
        clock_out_location: geolocation,
        clock_out_region: in_region,
        clock_out_is_approved: is_approved,
    });
    return await timesheet.save();
}

const getTimeSheets = async (emp_id) => {
    return await Timesheet.findAll({
        where: {
            emp_id: emp_id,
        },
        order: [
            ['updated_at', 'DESC']
        ]
    });
}

// this gets the latest record of the clock data for an employee.
// this is used to keep the clock persistent on the front end.
const getLatestClockRecord = async (emp_id) => {
    return await Timesheet.findOne({
        where: {
            emp_id: emp_id,
        },
        order: [['timesheet_id', 'DESC']]
    });
}

const getTimesheetByID = async (id) => {
    return await Timesheet.findOne({
        where: {
            timesheet_id: id,
        }
    })
}

const editTimesheet = async (timesheet, editData) => {
    if(editData.clock_in) {
        timesheet.set({
            clock_in_time: editData.clock_in,
        })
    }
    if(editData.clock_out) {
        timesheet.set({
            clock_out_time: editData.clock_out,
        })

    }
    if(editData.is_approved !== null) {
        timesheet.set({
            is_approved: editData.is_approved,
        })
    }
    return await timesheet.save();
}


module.exports = {
    getTimeSheets,
    clockIn,
    clockOut,
    getLatestClockRecord,
    editTimesheet,
    getTimesheetByID,
}
