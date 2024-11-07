const {Task} = require('../../models/task');
const sequelize = require('../db');

const getTask = async (task_id) => {
    return await Task.findOne({
        where: {
            task_id: task_id
        }
    });
}

const getProjectTasks = async (project_id) => {
    return await Task.findAll({
        where: {
            project_id: project_id
        },
        order: [
            ['updated_at', 'DESC']
        ]
    });
}

const createTask = async (user, new_task) => {
    return await Task.create({
        project_id: new_task.project_id,
        name: new_task.name,
        description: new_task.description
    });
}

const updateTask = async (task, task_edit) => {

    if (task_edit.name) {
        task.set({
            name: task_edit.name,
        });
    }
    if (task_edit.description) {
        task.set({
            description: task_edit.description,
        });
    }
    if (task_edit.status) {
        if (task_edit.status === 'COMPLETED') {
            task.set({
                status: task_edit.status,
                end_date: sequelize.literal('CURRENT_DATE'),
            });
        } else {
            task.set({
                status: task_edit.status,
                end_date: null,
            });
        }
    }

    return await task.save();
}

const deleteTask = async(task_id) => {
    const this_task = await Task.findOne({
        where: {
            task_id: task_id,
        }
    })

    return await this_task.destroy();
}

const getLatestTask = async (emp_id) => {
    return await Task.findOne({
        where: {
            assigned_employee: emp_id,
        },
        order: [['created_at', 'DESC']]
    })
}


module.exports = {
    getTask,
    getProjectTasks,
    createTask,
    updateTask,
    deleteTask,
    getLatestTask,
}
