const companyService = require('../../services/company-service');

const createCompany = async (req, res, next) => {
    try {
        const company = req.body;
        const response = await companyService.createCompany(company);

        return res.status(201).json(response);
    } catch (error) {
        console.log('Error', error);
        return next(error);
    }
}

const getCompany = async (req, res, next) => {
    try {
        const user = req.user;
        const response = await companyService.getCompany(user);

        return res.status(200).json(response);
    } catch (error) {
        console.log('Error: ', error);
        return next(error);
    }

}

const updateCompany = async (req, res, next) => {
    try {
        const request = req.body;
        const response = await companyService.updateCompany(request);

        return res.status(200).json(response);
    } catch (error) {
        console.log('Error: ', error);
        return next(error);
    }
}

const updateCompanyTimezone = async (req, res, next) => {
    try {
        const request = req.body;
        const response = await companyService.updateCompanyTimezone(request);
        return res.status(200).json(response);

    } catch (e) {
        console.log('Error: ', e);
        return next(e);
    }
}

const updateCompanyClockOutCronJob = async (req, res, next) => {
    try {
        const request = req.body;
        const response = await companyService.updateCompanyClockOutCronJob(request);
        return res.status(200).json(response);

    } catch (e) {
        console.log('Error: ', e);
        return next(e);
    }
}

module.exports = {
    createCompany,
    getCompany,
    updateCompany,
    updateCompanyTimezone,
    updateCompanyClockOutCronJob,
}
