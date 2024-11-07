const {Project} = require("../../models/project");
const {Sequelize, Op} = require("sequelize");
const {getProjectTasks, deleteTask} = require("./task-repository");

const findEmployeeProject = async (emp_id) => {

    return await Project.findOne({
        where: {
            assigned_employees: {[Op.contains]: [emp_id]},
        }
    });

}

const getProject = async (project_id) => {
    return await Project.findOne({
        where: {
            project_id: project_id,
        }
    })
}

const findAssignedProjects = async (emp_id) => {
    return await Project.findAll({
        where: {
            assigned_employees: {[Op.contains]: [emp_id]},
            status: {
                [Op.ne]: 'CANCELLED'
            }
        }
    });
}

const findAllProjects = async (company_name) => {
    return await Project.findAll({
        where: {
            company_name: company_name,
            status: {
                [Op.ne]: 'CANCELLED'
            }
        },
        order: [
            ['updated_at', 'DESC']
        ]
    });
}

const createProject = async (name, description, company_name) => {

    return await Project.create({
        name: name,
        description: description,
        company_name: company_name
    });

}

const updateProject = async (project, data) => {

    if (data.name) {
        project.set({
            name: data.name,
        });
    }
    if (data.description) {
        project.set({
            description: data.description,
        });
    }
    if (data.status) {
        if (data.status === 'COMPLETED' || data.status === 'CANCELLED') {
            project.set({
                status: data.status,
                end_date: Sequelize.literal('current_date'),
            });
        } else {
            project.set({
                status: data.status,
                end_date: null,
            });
        }
    }
    if (data.health) {
        project.set({
            health: data.health
        });
    }
    if (data.phase) {
        project.set({
            phase: data.phase
        });
    }

    return await project.save();

}

const deleteProject = async (project_id) => {
    const tasks = await getProjectTasks(project_id);

    for (let i in tasks) {
        await deleteTask(tasks[i].dataValues.task_id);
    }

    const this_project = await Project.findOne({
        where: {
            project_id: project_id
        }
    });

    await this_project.update({
        status: 'CANCELLED',
    });

    return await this_project.destroy();

}

const getLatestProject = async (emp_id) => {
    return await Project.findOne({
        where: {
            assigned_employees: {[Op.contains]: [emp_id]},
            status: {
                [Op.ne]: 'CANCELLED'
            },
        },
        order: [['created_at', 'DESC']]
    })
}

module.exports = {
    findEmployeeProject,
    findAssignedProjects,
    findAllProjects,
    createProject,
    updateProject,
    deleteProject,
    getProject,
    getLatestProject,
}