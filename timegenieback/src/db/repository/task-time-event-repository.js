const {TaskTimeEvent} = require('../../models/task-time-event');

const getTimeEvents = async(employee_id, task_id) => {
    return await TaskTimeEvent.findAll({
        where: {
            employee_id: employee_id,
            task_id: task_id,
        },
        order: [['event_id', 'DESC']]
    });
}

const getLatestTimeEvent = async(employee_id, task_id) => {
    return await TaskTimeEvent.findOne({
        where: {
            employee_id: employee_id,
            task_id: task_id,
            in_progress: true
        },
        order: [['event_id', 'DESC']]
    });
}

const getLatestEvent = async (employee_id, task_id) => {
    return await TaskTimeEvent.findOne({
        where: {
            employee_id: employee_id,
            task_id: task_id,
        },
        order: [['event_id', 'DESC']]
    });
}

const startTime = async(employee_id, task_id, tracking_id) => {
    return await TaskTimeEvent.create({
        employee_id: employee_id,
        task_id: task_id,
        tracking_id: tracking_id
    });
}

const stopTime = async(timeEvent) => {
    await timeEvent.set({
        stop_time: Date.now(),
        in_progress: false
    });
    return await timeEvent.save();
}


module.exports = {
    getTimeEvents,
    getLatestTimeEvent,
    startTime,
    stopTime,
    getLatestEvent
}
