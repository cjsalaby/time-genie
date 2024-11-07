import auth from '../services/auth-service';

const API_URL = process.env.API_URL;
const url = `${API_URL}/api/project`;

const getProject = async () => {
    try {
        const token = await auth.getToken();
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            mode: 'cors'
        });
        return await response.json();
    } catch (err) {
        console.log('Error at getProject: ', err);
        throw err;
    }
};

const getAllProjects = async () => {
    try {
        const token = await auth.getToken();
        const response = await fetch(`${url}/all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            mode: 'cors'
        });
        return await response.json();
    } catch (err) {
        console.log('Error at getAllProjects: ', err);
        throw err;
    }
};

const getAllAssignedProjects = async () => {
    try {
        const token = await auth.getToken();
        const response = await fetch(`${url}/assign`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            mode: 'cors'
        });
        return await response.json();
    } catch (err) {
        console.log('Error at getAllAssignedProjects: ', err);
        throw err;
    }
};

const createProject = async (request) => {
    try {
        const token = await auth.getToken();
        const response = await fetch(url, {
            method: 'PUT',
            body: JSON.stringify(request),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            mode: 'cors'
        });
        return response;
    } catch (err) {
        console.log('Error at createProject', err);
        throw err;
    }
};

const editProject = async (request) => {
    try {
        const token = await auth.getToken();
        const response = await fetch(url, {
            method: 'PATCH',
            body: JSON.stringify(request),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            mode: 'cors'
        });
        const resBody = await response.json();
        console.log(resBody);
        return response;
    } catch (err) {
        console.log('Error at editProject: ', err);
        throw err;
    }
};

const assignEmployee = async (request) => {
    try {
        const token = await auth.getToken();
        const response = await fetch(`${url}/assign`, {
            method: 'PATCH',
            body: JSON.stringify(request),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            mode: 'cors'
        });
        return response;
    } catch (err) {
        console.log('Error at assignEmployee: ', err);
        throw err;
    }
};

const getLatestProject = async () => {
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
        console.log('Error at getLatestProject: ', err);
        throw err;
    }
};

const deleteProject = async (project_id) => {
    try {
        const token = await auth.getToken();
         return await fetch(`${url}?project_id=${project_id}`, {
           method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            mode: 'cors'
        });
    } catch (e) {
        console.log('Error at deleteProject: ', e);
        throw e;
    }
}

module.exports = {
    getProject,
    getAllProjects,
    getAllAssignedProjects,
    editProject,
    createProject,
    assignEmployee,
    getLatestProject,
    deleteProject,
};
