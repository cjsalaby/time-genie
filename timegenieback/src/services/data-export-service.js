const timesheetRepo = require('../db/repository/timesheet-repository');
const {convertTimesheetsToCompanyTimezone} = require("./timesheet-service");
const {getManagerEmployees} = require("./employee-service");
const {getPastDate, getDifferenceInSeconds, convertHours} = require('../utils/date-fns-helper');
const csvHelper = require('../utils/csv-helper');
const employeeRepo = require('../db/repository/employee-repository');
const {notFoundError} = require("../utils/errors-helper");
const pdfHelper = require("../utils/pdf-helper");

const getJSONData = async (user, query) => {
    const daysAgo = getPastDate(query.days);
    const formattedDaysAgo = daysAgo.toISOString().split('T')[0];
    const managerEmployees = await getManagerEmployees(user);
    let jsonData = []
    for (const employee of managerEmployees) {
        jsonData.push(
            {
                emp_id: employee.dataValues.emp_id,
                username: employee.dataValues.username,
                first_name: employee.dataValues.first_name,
                last_name: employee.dataValues.last_name
            });
    }

    for (let i in jsonData) {
        let record = jsonData[i];
        const timeSheets = await timesheetRepo.getTimeSheets(record.emp_id);
        await convertTimesheetsToCompanyTimezone(user.company, timeSheets);
        let totalTime = 0;
        timeSheets.reverse();
        for (const timesheet of timeSheets) {
            const date = timesheet.dataValues.clock_in_time.toISOString().split('T')[0];
            if (date >= formattedDaysAgo) {
                const timeDifference = getDifferenceInSeconds(timesheet.dataValues.clock_out_time, timesheet.dataValues.clock_in_time);
                const timeSpent = convertHours(timeDifference);
                if (record[date] !== null) {
                    record[date] = [timeSpent]
                } else {
                    record[date].push(timeSpent);
                }
                totalTime += timeDifference;
            }
        }
        record['Total Time'] = convertHours(totalTime);
    }
    return jsonData;
}

const getEmployeeJSONData = async (user, query) => {
    const thisEmployee = await employeeRepo.getEmployee(query.username, user.company);
    if (!thisEmployee) {
        notFoundError('Employee with username ' + query.username + ' not found');
    }
    const timeSheets = await timesheetRepo.getTimeSheets(thisEmployee.emp_id);
    await convertTimesheetsToCompanyTimezone(user.company, timeSheets);
    const daysAgo = getPastDate(query.days);
    const formattedDaysAgo = daysAgo.toISOString().split('T')[0];

    const empTimeSheetData = [{
        emp_id: thisEmployee.emp_id,
        username: thisEmployee.username,
        first_name: thisEmployee.first_name,
        last_name: thisEmployee.last_name,
    }];

    let totalTime = 0;
    timeSheets.reverse();
    for (const timesheet of timeSheets) {
        const date = timesheet.dataValues.clock_in_time.toISOString().split('T')[0];

        if (date >= formattedDaysAgo) {
            const timeDifference = getDifferenceInSeconds(timesheet.dataValues.clock_out_time, timesheet.dataValues.clock_in_time);
            const timeSpent = convertHours(timeDifference);
            if (!empTimeSheetData[date]) {
                empTimeSheetData[0][date] = [];
            }
            empTimeSheetData[0][date].push(timeSpent);

            totalTime += timeDifference;
        }
    }
    empTimeSheetData[0]['Total Time'] = convertHours(totalTime);
    return empTimeSheetData;
}

const getCSVData = async (user, query, getAllEmployees) => {
    const jsonData = getAllEmployees?
        await getJSONData(user, query) : await getEmployeeJSONData(user, query);
    return csvHelper.jsonToCSV(jsonData);
}

const getPDFData = async (user, query, getAllEmployees) => {
    const jsonData =
        getAllEmployees? await getJSONData(user, query) : await getEmployeeJSONData(user, query);

    const htmlData = pdfHelper.jsonToHTML(jsonData);
    return await pdfHelper.getPdfBuffer(htmlData);
}

module.exports = {
    getCSVData,
    getPDFData
}
