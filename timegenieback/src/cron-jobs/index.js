const cron = require('node-cron');
const {checkClockInBoundaries} = require("./check-clock-in-boundaries");
const {getAllCompanies} = require("../services/company-service");
const {resetRemainingBreaks} = require("./reset-remaining-breaks");
const {stopBreaks} = require("./stop-breaks");

const cronBuilder = async(jobName, runnerFunction, options) => {
    const companies = await getAllCompanies();

    if (options.companyCronExpression) {

        for (let i = 0; i < companies.length; i++) {
            const company = companies[i].dataValues;
            const companyName = company.name;
            const cronExpression = company.clockoutcronexpression;
            const timezone = company.timezone;

            console.log(`Scheduling: ${jobName} at ${cronExpression} for ${companyName} in timezone ${timezone}`);

            try {
                cron.schedule(cronExpression, async () => {
                    console.log(`${jobName} for all ${companyName} employees`);
                    await runnerFunction(companyName);
                }, {
                    scheduled: true,
                    timezone: timezone
                });
            } catch (e) {
                console.error(e);
            }
        }
    }
    else if (options.cronExpression) {
        for (let i = 0; i < companies.length; i++) {

            const company = companies[i].dataValues;
            const companyName = company.name;

            console.log(`Scheduling: ${jobName} at ${options.cronExpression} for ${companyName}`);
            try {
                cron.schedule(options.cronExpression, async () => {
                    console.log(`Stopping breaks for ${companyName}`);
                    await runnerFunction(companyName);
                },  {
                    scheduled: true,
                });
            } catch (e) {
                console.error(e);
            }
        }


    }
}

const scheduleClockOut = async () => {
    await cronBuilder('Automatic Clock Out', checkClockInBoundaries, {companyCronExpression: true});
}

const scheduleResetBreaks = async () => {
    await cronBuilder('Reset Remaining Breaks', resetRemainingBreaks, {companyCronExpression: true});
}

const scheduleStopBreaks = async () => {
    await cronBuilder('Automatic Break Stop', stopBreaks, {cronExpression: '*/5 * * * *'});
}

const startCronJobs = async () => {
    await scheduleClockOut();
    await scheduleResetBreaks();
    await scheduleStopBreaks();
}

module.exports = {
    startCronJobs
}

