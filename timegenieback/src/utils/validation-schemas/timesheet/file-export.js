const Joi = require('joi');

const fileExport = Joi.object({
    days: Joi.number(),
});

module.exports = {
    fileExport
}