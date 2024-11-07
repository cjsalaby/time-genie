const Joi = require('joi');

const getAllEmployeesFromCompanyValidationSchema = Joi.object({
    name: Joi.string()
});

module.exports = {
    getAllEmployeesFromCompanyValidationSchema
}
