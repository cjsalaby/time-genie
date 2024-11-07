const {differenceInSeconds, format, subDays, isValid, parse} = require("date-fns");
const {formatInTimeZone, zonedTimeToUtc, utcToZonedTime} = require('date-fns-tz');
const {parseISO} = require("date-fns/fp");
const {internalServerError} = require("./errors-helper");

const getToday = () => {
    return new Date();
}

const getPastDate = (daysAgo) => {
    if(daysAgo != null) {
        return subDays(new Date(), daysAgo);
    }
    return subDays(new Date(), 7);
}

const formatDate = (date) => {

    return parseISO(format(date, 'yyyy/MM/dd HH:mm:ss'));
}

const getDifferenceInSeconds = (date1, date2) => {
    return differenceInSeconds(date1, date2);
}

const formatDateWithTimezone = (date, timezone) => {
    return formatInTimeZone(date, timezone, 'yyyy-mm-dd HH-mm-ss');
}

const parseDate = (date, format = 'yyyy-MM-dd HH:mm') => {
    return parse(date,format, new Date());
}

const sevenDayHourTotal = (timeSheets) => {
    const today = getToday()
    const sevenDaysAgo = getPastDate(7)

    const totalSeconds = timeSheets.reduce((total, entry) => {
        if (entry.clock_out_time) {
            const clockInTime = entry.clock_in_time
            const clockOutTime = entry.clock_out_time
            if (clockInTime < today && clockInTime > sevenDaysAgo || clockOutTime < today && clockOutTime > sevenDaysAgo) {
                const duration = getDifferenceInSeconds(clockInTime, clockOutTime);
                total -= duration;
            }
        }
        return total;

    }, 0)

    return convertHours(totalSeconds);
}

const thirtyDayHourTotal = (timeSheets) => {
    const today = getToday()
    const thirtyDaysAgo = getPastDate(30)

    const totalSeconds = timeSheets.reduce((total, entry) => {
        if (entry.clock_out_time) {
            const clockInTime = entry.clock_in_time
            const clockOutTime = entry.clock_out_time
            if (clockInTime < today && clockInTime > thirtyDaysAgo || clockOutTime < today && clockOutTime > thirtyDaysAgo) {
                const duration = getDifferenceInSeconds(clockInTime, clockOutTime);
                total -= duration;
            }
        }
        return total;
    }, 0)

    return convertHours(totalSeconds);
}

const totalHours = (timeSheets) => {
    const today = formatDate(getToday());

    const totalSeconds = timeSheets.reduce((total, entry) => {
        if (entry.clock_out_time) {
            const clockInTime = formatDate(entry.clock_in_time);
            const clockOutTime = formatDate(entry.clock_out_time);

            if (clockInTime < today || clockOutTime < today) {
                const duration = getDifferenceInSeconds(clockInTime, clockOutTime);
                total += duration; // Use addition to accumulate total duration
            }
        }
        return total;
    }, 0);

    return convertHours(totalSeconds);
};

const convertHours = (decimalSeconds) => {
    const hours = Math.floor(decimalSeconds / 3600);
    const minutes = Math.ceil((decimalSeconds % 3600) / 60);
    const seconds = decimalSeconds % 60;
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

const convertDateToTimezone = (date, timezone) => {
    if (date === null || date === '') {
        return '';
    }
    // Convert from UTC to target timezone
    try {
        return utcToZonedTime(date, timezone);
    } catch (err) {
        console.error(err);
        internalServerError();
    }
}

module.exports = {
    getToday,
    getPastDate,
    formatDate,
    getDifferenceInSeconds,
    formatDateWithTimezone,
    isValid,
    parse,
    parseDate,
    utcToZonedTime,
    zonedTimeToUtc,
    sevenDayHourTotal,
    thirtyDayHourTotal,
    totalHours,
    convertHours,
    convertDateToTimezone
}
