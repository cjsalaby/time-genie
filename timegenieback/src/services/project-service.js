const projectRepo = require("../db/repository/project-repository");
const employeeRepo = require('../db/repository/employee-repository');
const projectTimeTrackingRepo = require('../db/repository/project-time-tracking-repository');
const {Sequelize} = require("sequelize");
const {notFoundError, badRequestError} = require("../utils/errors-helper");

const getCurrentProject = async (user) => {
    const employee = await employeeRepo.getEmployee(user.username, user.company);
    if (!employee) {
        notFoundError('This employee does not exist.');
    }
    const project = await projectRepo.findEmployeeProject(employee.emp_id);
    if (!project) {
        notFoundError(`No projects assigned to this user`);
    }
    return project;
}

const getProject = async(projectId) => {
    const project = await projectRepo.getProject(projectId);

    if (!project) {
        notFoundError(`Project with id ${projectId} does not exist`);
    }
    return project;
}

const getAllProjects = async (company_name) => {
    const projects = await projectRepo.findAllProjects(company_name);

    if (!projects) {
        notFoundError(`No projects found from company: ${company_name}`);
    }
    // Add ids from any assigned employees in the current projects
    const idSet = new Set();
    for (let i in projects) {
        const ids = projects[i].dataValues.assigned_employees;
        if (ids !== null) {
            ids.forEach(item => idSet.add(item));
        }
    }
    // Grab usernames from the ids in the set
    const employeeMap = getIdToUsernameMap(await employeeRepo.getEmployeesFromIds(Array.from(idSet)));
    // Add usernames to projects before they are returned
    for (let i in projects) {
        const ids = projects[i].dataValues.assigned_employees;
        projects[i].dataValues.assigned_employees = [];
        for (let j in ids) {
            if (employeeMap.has(ids[j])) {
                projects[i].dataValues.assigned_employees.push(employeeMap.get(ids[j]));
            }
        }
    }
    return projects;
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

const createProject = async (user, body) => {
    return await projectRepo.createProject(body.name, body.description, user.company);
}

const updateProject = async (user, new_info) => {
    const {
        project_id,
        name,
        description,
        status,
        health,
        phase,
    } = new_info;

    const project = await projectRepo.getProject(project_id);

    if(!project) {
        notFoundError(`Project with id ${project_id} does not exist.`);
    }

    const updateData = {
        name,
        description,
        status,
        health,
        phase
    }

    return await projectRepo.updateProject(project, updateData);
}

const deleteProject = async (project_id) => {
    return await projectRepo.deleteProject(project_id);
}

const getAssignedProjects = async (user) => {
    const employee = await employeeRepo.getEmployee(user.username, user.company);
    if (!employee) {
        notFoundError('Employee does not exist');
    }
    return await projectRepo.findAssignedProjects(employee.emp_id);
};

const assignEmployee = async (user, request) => {
    const employee = await employeeRepo.getEmployee(request.username, user.company);
    if(!employee) {
        notFoundError('Employee does not exist.');
    }

    const project = await projectRepo.getProject(request.project_id);
    if(!project) {
        notFoundError(`Project with id ${request.project_id} does not exist.`);
    }
    if(project.assigned_employees != null && project.assigned_employees.includes(employee.emp_id)) {
        badRequestError('Employee is already assigned to this project.');
    }

    project.update(
        {'assigned_employees': Sequelize.fn('array_append', Sequelize.col('assigned_employees'), employee.emp_id)},
        {'where': {'project_id': request.project_id}}
    )

    // Create a time tracking record after assigning the employee
    await projectTimeTrackingRepo.createProjectTimeTracking(employee.emp_id, project.project_id);

    return project;
}

const getLatestProject = async (user) => {
    const employee = await employeeRepo.getEmployee(user.username, user.company);
    if(!employee) {
        notFoundError('Employee does not exist.');
    }
    return await projectRepo.getLatestProject(employee.emp_id);
}

module.exports = {
    getProject,
    getCurrentProject,
    getAllProjects,
    createProject,
    updateProject,
    deleteProject,
    getAssignedProjects,
    assignEmployee,
    getLatestProject,
}
