const timeChangeRequestService = require('../../services/timechange-request-service');

const getEmployeeTimeChangeRequests = async (req, res, next) => {
    try {
        const user = req.user;
        const response = await timeChangeRequestService.getEmployeeTimeChangeRequests(user);

        return res.status(200).json(response);
    } catch (error) {
        console.log('Error: ', error);
        return next(error);
    }
}

const getAllManagerEmployeeTimeChangeRequests = async (req, res, next) => {
    try {
        const user = req.user;
        const response = await timeChangeRequestService.getAllManagerEmployeeTimeChangeRequests(user);

        return res.status(200).json(response);
    } catch (error) {
        console.log('Error: ', error);
        return next(error);
    }
}

const addTimeChangeRequest = async(req, res, next) => {
    try {
        const user = req.user;
        const { timesheet_id, description } = req.body;
        const response = await timeChangeRequestService.addTimeChangeRequest(user, timesheet_id, description);

        return res.status(201).json(response);
    } catch (error) {
        console.log('Error: ', error);
        return next(error);
    }
}

const setApproval = async (req, res, next) => {
    try {
        const user = req.user;
        const {id, approval} = req.body;
        const response = await timeChangeRequestService.setApproval(user, id, approval);

        return res.status(200).json(response);
    } catch (error) {
        console.log('Error: ', error);
        return next(error);
    }
}

module.exports = {
    getEmployeeTimeChangeRequests,
    getAllManagerEmployeeTimeChangeRequests,
    addTimeChangeRequest,
    setApproval
}
