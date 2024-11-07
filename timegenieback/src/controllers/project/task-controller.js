const taskService = require('../../services/task-service');

const createTask = async (req, res, next) => {
    try {
        const user = req.user;
        const new_task = req.body;
        const response = await taskService.createTask(user, new_task);

        return res.status(201).json(response);
    } catch (error) {
        console.log('Error:', error);
        return next(error);
    }
}

const getTask = async (req, res, next) => {
    try {
        const task_id = req.query.task_id;
        const response = await taskService.getTask(task_id);

        return res.status(200).json(response);
    } catch (error) {
        console.log('Error:', error);
        return next(error);
    }
}

const getProjectTasks = async (req, res, next) => {
    try {
        const project_id = req.query.project_id;
        const response = await taskService.getProjectTasks(project_id);

        return res.status(200).json(response);
    } catch (error) {
        console.log('Error:', error);
        return next(error);
    }
}

const updateTask = async (req, res, next) => {
    try {
        const task_edit = req.body;
        const response = await taskService.updateTask(task_edit);

        return res.status(200).json(response);
    } catch (error) {
        console.log('Error: ', error);
        return next(error);
    }
}

const deleteTask = async (req, res, next) => {
    try {
        const task_id = req.query.task_id;
        const response = await taskService.deleteTask(task_id);

        return res.status(200).json(response);
    } catch (error) {
        console.log('Error: ', error);
        return next(error);
    }
}

const assignEmployee = async (req, res, next) => {
    try {
        const user = req.user;
        const request = req.body;
        const response = await taskService.assignEmployee(user, request);

        return res.status(200).json(response);
    } catch (error) {
        console.log('Error: ', error);
        return next(error);
    }
}

const assignSelf = async (req, res, next) => {
    try {
        const user = req.user;
        const request = req.body;
        const response = await taskService.assignSelf(user, request);

        return res.status(200).json(response);
    } catch (error) {
        console.log('Error:', error);
        return next(error);
    }
}

/**
 * This route returns the latest task that the user is assigned to.
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getLatestTask = async (req, res, next) => {
    try {
        const user = req.user;
        const response = await taskService.getLatestTask(user);
        return res.status(200).json(response);
    } catch (error) {
        console.log('Error at getLatestTask: ', error);
        return next(error)
    }
}

module.exports = {
    createTask,
    updateTask,
    getTask,
    getProjectTasks,
    deleteTask,
    assignEmployee,
    assignSelf,
    getLatestTask,
}
