const companyRepo = require('../db/repository/company-repository');
const {badRequestError, notFoundError} = require("../utils/errors-helper");
const { isValidTimezone } = require('../utils/timezone-validation');
const { isValidCronExpression } = require('../utils/cron-job-helper');
const createCompany = async (company) => {
    const {name, phone, email, description, address1, city, state, country, postalcode, timezone} = company;

    if (await companyRepo.getCompany(name)) {
        badRequestError('This company already exists.');
    }

    const companyData = {
        name,
        phone,
        email,
        description,
        address1,
        city,
        state,
        country,
        postalcode,
        timezone
    }

    return await companyRepo.createCompany(companyData);
}

const getCompany = async (user) => {
    const company = await companyRepo.getCompany(user.company);
    if (!company) {
        notFoundError('This company does not exist.');
    }

    return company;
}

/**
 * Internal function to retrieve all companies for Cron Job purposes
 *
 */
const getAllCompanies = async ()  => {
    return await companyRepo.getAllCompanies();
}

const updateCompany = async (request) => {
    const {name, phone, email, description, address1, city, state, country, postalcode, timezone} = request;

    const company = await companyRepo.getCompany(name);

    if (!company) {
        notFoundError('This company does not exist.');
    }

    const updateData = {
        name, phone, email, description,
        address1, city, state, country, postalcode, timezone
    }

    return await companyRepo.updateCompany(company, updateData);
}

const updateCompanyTimezone = async (request) => {
    const company = await companyRepo.getCompany(request.name);
    if(!company) {
        notFoundError('This company does not exist.');
    }

    const timezone = request.timezone;
    if(!isValidTimezone(timezone)) {
        return badRequestError('Invalid timezone format. ex. Country/Region')
    }

    return await companyRepo.updateCompanyTimezone(company, timezone);
}

const updateCompanyClockOutCronJob = async (request) => {
    const company = await companyRepo.getCompany(request.name);
    if(!company) {
        notFoundError('This company does not exist.');
    }

    const isValidExp = isValidCronExpression(request.cron_job);
    if(isValidExp.isValid === false) {
        return badRequestError(`Invalid expression: ${isValidExp.errorMessage}`)
    }

    return await companyRepo.updateCompanyClockOutCronJob(company, request.cron_job);


}

module.exports = {
    createCompany,
    getCompany,
    getAllCompanies,
    updateCompany,
    updateCompanyTimezone,
    updateCompanyClockOutCronJob,
}
