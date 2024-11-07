const CronParser = require('cron-parser');
const cron = require('node-cron');

const isValidCronExpression = (exp) => {

    const segments = exp.split(' ');
    if (segments.length < 5 || segments.length > 6) {
        return {
            isValid: false,
            errorMessage: "Cron expression must have 5-6 segments separated by space." };
    }

    try {
        CronParser.parseExpression(exp);
        return {
            isValid: true,
        };

    } catch (e) {
        return {
            isValid: false,
            errorMessage: e.message,
        };
    }
}

module.exports = {
    isValidCronExpression,
}