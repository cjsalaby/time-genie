const Company = require('../../models/company');


const createCompany = async (companyData) => {
    const company = new Company(companyData);
    return await company.save();
}

const getCompany = async (company) => {
    return await Company.findOne({
        where: {
            name: company,
        },
        order: [
            ['updated_at', 'DESC']
        ]
    });
}

const getAllCompanies = async () => {
    return await Company.findAll();
}

const updateCompany = async (company, updateData) => {
    Object.keys(updateData).forEach((key) => {
        if (updateData[key] !== undefined) {
            company.set({[key]: updateData[key]});
        }
    });

    return await company.save();
}

const updateCompanyTimezone = async (company, timezone) => {
    company.set({
        timezone: timezone,
    })

    return company.save();
}

const updateCompanyClockOutCronJob = async (company, cron_job) => {
    company.set({
        clockoutcronexpression: cron_job,
    })

    return company.save();
}

module.exports = {
    getCompany,
    getAllCompanies,
    createCompany,
    updateCompany,
    updateCompanyTimezone,
    updateCompanyClockOutCronJob,
}
