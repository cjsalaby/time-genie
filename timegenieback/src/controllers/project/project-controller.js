const projectService = require("../../services/project-service");

/**
 * A manager calls this to query a project with a projectId
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getProject = async (req, res, next) => {
    try {
        const projectId = req.query.project_id
        const response = await projectService.getProject(projectId);

        return res.status(200).json(response);
    } catch (error) {
        console.log('Error', error)
        return next(error);
    }
}

/**
 * Queries the current project for an employee
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getCurrentProject = async(req, res, next) => {
    try {
        const user = req.user;
        const response = await projectService.getCurrentProject(user);

        return res.status(200).json(response)
    } catch (error) {
        console.log('Error', error)
        return next(error);
    }
}

const getAllProjects = async (req, res, next) => {
    try {
        const user = req.user;
        const response = await projectService.getAllProjects(user.company);

        return res.status(200).json(response);
    } catch (error) {
        console.log('Error', error);
        return next(error);
    }
}

const createProject = async (req, res, next) => {
    try {
        const user = req.user;
        const project = req.body;
        const response = await projectService.createProject(user, project);

        return res.status(201).json(response);
    } catch (error) {
        console.log('Error:', error);
        return next(error);
    }
}

const updateProject = async (req, res, next) => {
    try {
        const user = req.user;
        const new_info = req.body;
        const response = await projectService.updateProject(user, new_info);

        console.log('\nTask updated.');
        return res.status(200).json(response);
    } catch (error) {
        console.log('err', error);
        return next(error);
    }
}

const deleteProject = async (req, res, next) => {
    try {
        const projectId = req.query.project_id;
        const response = await projectService.deleteProject(projectId);

        return res.status(200).json(response);
    } catch (error) {
        console.log('Error: ', error);
        return next(error);
    }
}

const getAssignedProjects = async (req, res, next) => {
    try {
        const user = req.user;
        const response = await projectService.getAssignedProjects(user);

        return res.status(200).json(response);
    } catch (error) {
        console.log('Error: ', error)
        return next(error);
    }
};

const assignEmployee = async (req, res, next) => {
    try {
        const user = req.user;
        const request = req.body;
        const response = await projectService.assignEmployee(user, request);

        return res.status(200).json(response);
    } catch (error) {
        console.log('Error: ', error)
        return next(error);
    }
}

/**
 * This call gets the latest project that this user is assigned to.
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const getLatestProject = async (req, res, next) => {
    try {
        const user = req.user;
        const response = await projectService.getLatestProject(user);
        return res.status(200).json(response);
    } catch (error) {
        console.log('Error: ', error);
        return next(error);
    }
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
