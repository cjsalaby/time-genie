const { TimeChangeRequest } = require('../../models/timechange-request');

const getTimeChangeRequest = async (id) => {
    return await TimeChangeRequest.findOne({
        where: {
            id: id
        }
    });
}

const getAllTimeChangeRequestFromEmpId = async (emp_id) => {
    return await TimeChangeRequest.findAll({
        where: {
            emp_id: emp_id
        },
        order: [['updated_at', 'DESC']]
    });
}

const getAllEmployeeTimeChangeRequests = async (emp_ids) => {
    return await TimeChangeRequest.findAll({
        where: {
            emp_id: emp_ids
        },
        order: [['updated_at', 'DESC']]
    });
}

const addTimeChangeRequest = async (emp_id, timesheet_id, description) => {
    return await TimeChangeRequest.create({
        emp_id: emp_id,
        timesheet_id: timesheet_id,
        description: description
    });
}

const setApproval = async (timeChangeRequest, approval) => {
    await timeChangeRequest.set({
        is_approved: approval
    })
    return await timeChangeRequest.save();
}

module.exports = {
    getTimeChangeRequest,
    getAllTimeChangeRequestFromEmpId,
    getAllEmployeeTimeChangeRequests,
    addTimeChangeRequest,
    setApproval
}
