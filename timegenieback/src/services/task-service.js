const projectRepo = require('../db/repository/project-repository');
const taskRepo = require('../db/repository/task-repository');
const employeeRepo = require('../db/repository/employee-repository');
const {notFoundError, badRequestError} = require("../utils/errors-helper");
const {getProjectTimeTracking} = require("../db/repository/project-time-tracking-repository");
const {createTaskTimeTracking} = require("../db/repository/task-time-tracking-repository");
const {MANAGER} = require("../constants/roles");

const getTask = async (task_id) => {
    const task = await taskRepo.getTask(task_id);
    if (!task) {
        notFoundError(`Task_id: ${task_id} does not exist.`);
    }

    return task;
}

const getProjectTasks = async (project_id) => {
    const project = await projectRepo.getProject(project_id);
    if (!project) {
        notFoundError(`Project with id: ${project_id} does not exist.`);
    }
    const tasks = await taskRepo.getProjectTasks(project_id);
    for (let i = 0; i < tasks.length; i++) {
        tasks[i].dataValues.project_name = project.name;
    }

    const idSet = new Set();
    // Grab ids from the assigned employees
    for (let i in tasks) {
        const id = tasks[i].dataValues.assigned_employee;
        idSet.add(id);
    }
    // Grab usernames for all ids in the set
    const employeeMap = getIdToUsernameMap(await employeeRepo.getEmployeesFromIds(Array.from(idSet)));
    // Add usernames to tasks before they are returned
    for (let i in tasks) {
        const id = tasks[i].dataValues.assigned_employee;
        if (employeeMap.has(id)) {
            tasks[i].dataValues.assigned_employee = employeeMap.get(id);
        } else {
            tasks[i].dataValues.assigned_employee = 'unassigned'
        }
    }
    return tasks;
}

const getIdToUsernameMap = (employees) => {
    const map = new Map();
    for (let i in employees) {
        const emp_id = employees[i].dataValues.emp_id;
        const username = employees[i].dataValues.username;
        map.set(emp_id, username);
    }
    return map;
}

const createTask = async (user, new_task) => {
    const project = await projectRepo.getProject(new_task.project_id);
    if (!project) {
        notFoundError(`The project with id: ${new_task.project_id} does not exist.`);
    }

    const newTask = await taskRepo.createTask(user, new_task);
    if (!user.roles.includes(MANAGER)) {
        await assignSelf(user, { task_id: newTask.task_id })
    }
    return newTask
}

const updateTask = async (task_edit) => {
    const task = await taskRepo.getTask(task_edit.task_id);
    if (!task) {
        notFoundError(`Task_id: ${task_edit.task_id} does not exist.`);
    }

    return await taskRepo.updateTask(task, task_edit);
}

const deleteTask = async (task_id) => {
    return await taskRepo.deleteTask(task_id);
}

const assignEmployee = async (user, request) => {
    const task = await taskRepo.getTask(request.task_id);
    const employee = await employeeRepo.getEmployee(request.username, user.company);

    if(!task) {
        notFoundError(`Task with id: ${request.task_id} does not exist.`);
    }
    if(!employee) {
        notFoundError(`Employee with username ${request.username} does not exist.`);
    }

    const project_id = task.project_id;
    const project = await projectRepo.getProject(project_id);
    if (!project.assigned_employees) {
        badRequestError('Employee is not assigned to this project.');
    }
    else if(!project.assigned_employees.includes(employee.emp_id)) {
        badRequestError('Employee is not assigned to this project.');
    }

    if(task.assigned_employee === employee.emp_id) {
        badRequestError('This employee is already assigned to this task.');
    }

    task.update(
        {'assigned_employee': employee.emp_id}
    );

    // Create a time tracking record after assigning the employee
    const projectTimeTracking = await getProjectTimeTracking(employee.emp_id, project_id);
    await createTaskTimeTracking(employee.emp_id, task.task_id, projectTimeTracking.dataValues.tracking_id);

    return task;
}

const assignSelf = async (user, request) => {
    const employee = await employeeRepo.getEmployee(user.username, user.company);
    const task = await taskRepo.getTask(request.task_id);
    if(!employee) {
        notFoundError('Employee not found');
    }
    if(!task) {
        notFoundError(`Task with id: ${request.task_id} does not exist.`);
    }

    const project_id = task.project_id;
    const project = await projectRepo.getProject(project_id);
    if(!project.assigned_employees.includes(employee.emp_id)) {
        badRequestError('Employee is not assigned to this project.');
    }
    if(task.assigned_employee === employee.emp_id) {
        badRequestError('This employee is already assigned to this task.');
    }

    task.update(
        {'assigned_employee': employee.emp_id}
    );
    const projectTimeTracking = getProjectTimeTracking(employee.emp_id, project_id);
    await createTaskTimeTracking(employee.emp_id, task.task_id, projectTimeTracking.tracking_id);
    return task;
}

const getLatestTask = async (user) => {
    const employee = await employeeRepo.getEmployee(user.username, user.company);
    if(!employee) {
        notFoundError("Employee not found.");
    }
    return await taskRepo.getLatestTask(employee.emp_id);
}

module.exports = {
    getTask,
    getProjectTasks,
    createTask,
    updateTask,
    deleteTask,
    assignEmployee,
    assignSelf,
    getLatestTask,
}
