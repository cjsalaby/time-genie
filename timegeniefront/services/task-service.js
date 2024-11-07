import auth from './auth-service';
import {getTotalTaskTime} from "./timetracking-service";

const API_URL = process.env.API_URL;
const url = `${API_URL}/api/task`;

const getAllTasks = async (project_id) => {
    try {
        const token = await auth.getToken();
        const response = await fetch(`${url}/project?project_id=${project_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            mode: 'cors'
        });

        const tasksData =  await response.json();
        const user = await auth.getUserInfo();

        return await Promise.all(tasksData.map(async (task) => {
            const assigned_emp = task.assigned_employee;
            if(user.username === assigned_emp) {
                const timetracking = await getTotalTaskTime(task.task_id);
                task.totalTime = timetracking.time_spent;
                task.in_progress = timetracking.in_progress;
            }
            return task;
        }));

    } catch (err) {
        console.log('Error: ', err);
        throw err;
    }
};

const createTask = async (request) => {
    try {
        const token = await auth.getToken();
        const response = await fetch(`${url}`, {
            method: 'PUT',
            body: JSON.stringify(request),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            mode: 'cors'
        });
        return await response;
    } catch (err) {
        console.log('Error: ', err);
        throw err;
    }
};

const editTask = async (request) => {
    try {
        const token = await auth.getToken();
        const response = await fetch(`${url}`, {
            method: 'PATCH',
            body: JSON.stringify(request),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            mode: 'cors'
        });
        return await response;
    } catch (err) {
        console.log('Error: ', err);
        throw err;
    }
};

const assignEmployee = async (request) => {
    try {
        const token = await auth.getToken();
        const response = await fetch(`${url}/assign/employee`, {
            method: 'PATCH',
            body: JSON.stringify(request),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            mode: 'cors'
        });
        return await response;
    } catch (err) {
        console.log('Error: ', err);
        throw err;
    }
};

const getLatestTask = async () => {
    try {
        const token = await auth.getToken();
        const response = await fetch(`${url}/latest`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            mode: 'cors'
        });
        return await response.json();
    } catch (err) {
        console.log('Error at getLatestTask: ', err);
        throw err;
    }
};

const deleteTask = async (task_id) => {
    try {
        const token = await auth.getToken();
        return await fetch(`${url}?task_id=${task_id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            mode: 'cors'
        });
    } catch (e) {
        console.log('Error at deleteTask: ', e);
        throw e;
    }
}

module.exports = {
    getAllTasks,
    createTask,
    editTask,
    assignEmployee,
    getLatestTask,
    deleteTask,
};
